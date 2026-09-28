import { supabase } from '../../lib/supabase';
import { compressImage } from '../../lib/utils/compressImage';
import type { Database } from '../../types/database';
import type { Program, ProgramFull, DayWithExercises } from '../../types/domain';

type ProgramUpdate = Database['public']['Tables']['programs']['Update'];
type ProgramDayInsert = Database['public']['Tables']['program_days']['Insert'];
type ProgramDayUpdate = Database['public']['Tables']['program_days']['Update'];
type ProgramExerciseInsert = Database['public']['Tables']['program_exercises']['Insert'];
type ProgramExerciseUpdate = Database['public']['Tables']['program_exercises']['Update'];

// Mismo bucket público que las miniaturas de ejercicios (features/exercises/api.ts):
// mismo tipo de archivo, mismas políticas de storage (solo admin sube/edita/borra).
const THUMBNAILS_BUCKET = 'exercise-thumbnails';

export async function uploadReplacementCoverImage(file: File): Promise<string> {
  const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800 });
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(THUMBNAILS_BUCKET).upload(path, compressed);
  if (error) throw error;
  return supabase.storage.from(THUMBNAILS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listTemplates(): Promise<Program[]> {
  const { data, error } = await supabase.from('programs').select('*').is('user_id', null).order('name');
  if (error) throw error;
  return data;
}

export async function createTemplate(name: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .insert({ name, user_id: null, cycle_pattern: [1], total_weeks: 1 })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase.from('programs').delete().eq('id', id);
  if (error) throw error;
}

export async function updateProgram(id: string, input: ProgramUpdate): Promise<Program> {
  const { data, error } = await supabase.from('programs').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getProgramFull(programId: string): Promise<ProgramFull> {
  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('id', programId)
    .single();
  if (programError) throw programError;

  const { data: days, error: daysError } = await supabase
    .from('program_days')
    .select('*, program_exercises(*, exercises(*))')
    .eq('program_id', programId)
    .order('week_number', { ascending: true })
    .order('position', { ascending: true });
  if (daysError) throw daysError;

  const daysWithExercises = (days ?? []).map((day) => {
    const { program_exercises, ...rest } = day;
    return {
      ...rest,
      exercises: [...program_exercises]
        .sort((a, b) => a.position - b.position)
        .map(({ exercises, ...pe }) => ({ ...pe, exercise: exercises })),
    };
  }) as DayWithExercises[];

  return { ...program, days: daysWithExercises };
}

// Biblioteca de reemplazos: program_days con program_id = null, no atados a
// ningún programa/semana. Cualquier alumno con suscripción activa los puede
// tomar en vez de su rutina del día (ver RLS en 0011_replacement_library.sql).
export async function listReplacementDays(): Promise<DayWithExercises[]> {
  const { data, error } = await supabase
    .from('program_days')
    .select('*, program_exercises(*, exercises(*))')
    .is('program_id', null)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((day) => {
    const { program_exercises, ...rest } = day;
    return {
      ...rest,
      exercises: [...program_exercises]
        .sort((a, b) => a.position - b.position)
        .map(({ exercises, ...pe }) => ({ ...pe, exercise: exercises })),
    };
  }) as DayWithExercises[];
}

export async function getReplacementDay(id: string): Promise<DayWithExercises> {
  const { data, error } = await supabase
    .from('program_days')
    .select('*, program_exercises(*, exercises(*))')
    .eq('id', id)
    .single();
  if (error) throw error;

  const { program_exercises, ...rest } = data;
  return {
    ...rest,
    exercises: [...program_exercises]
      .sort((a, b) => a.position - b.position)
      .map(({ exercises, ...pe }) => ({ ...pe, exercise: exercises })),
  } as DayWithExercises;
}

export async function createDay(input: ProgramDayInsert) {
  const { data, error } = await supabase.from('program_days').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateDay(id: string, input: ProgramDayUpdate) {
  const { data, error } = await supabase.from('program_days').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteDay(id: string) {
  const { error } = await supabase.from('program_days').delete().eq('id', id);
  if (error) throw error;
}

export async function createProgramExercise(input: ProgramExerciseInsert) {
  const { data, error } = await supabase.from('program_exercises').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateProgramExercise(id: string, input: ProgramExerciseUpdate) {
  const { data, error } = await supabase.from('program_exercises').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProgramExercise(id: string) {
  const { error } = await supabase.from('program_exercises').delete().eq('id', id);
  if (error) throw error;
}

export async function assignTemplate(templateId: string, userId: string, startsOn: string): Promise<string> {
  const { data, error } = await supabase.rpc('assign_template', {
    p_template_id: templateId,
    p_user_id: userId,
    p_starts_on: startsOn,
  });
  if (error) throw error;
  return data;
}

export async function listStudentPrograms(userId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
