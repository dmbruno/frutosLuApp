import { supabase } from '../../lib/supabase';
import { compressImage } from '../../lib/utils/compressImage';
import type { Exercise } from '../../types/domain';
import type { Database, ExerciseBlock } from '../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type ExerciseUpdate = Database['public']['Tables']['exercises']['Update'];

const THUMBNAILS_BUCKET = 'exercise-thumbnails';

export async function uploadExerciseThumbnail(file: File): Promise<string> {
  const compressed = await compressImage(file, { maxWidth: 480, maxHeight: 480 });
  const path = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(THUMBNAILS_BUCKET).upload(path, compressed);
  if (error) throw error;
  return supabase.storage.from(THUMBNAILS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listExercises(search?: string, block?: ExerciseBlock, archived = false): Promise<Exercise[]> {
  let query = supabase.from('exercises').select('*').eq('is_archived', archived).order('name');
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (block) {
    query = query.eq('default_block', block);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createExercise(input: ExerciseInsert): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateExercise(id: string, input: ExerciseUpdate): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function archiveExercise(id: string): Promise<void> {
  const { error } = await supabase.from('exercises').update({ is_archived: true }).eq('id', id);
  if (error) throw error;
}

export async function reactivateExercise(id: string): Promise<void> {
  const { error } = await supabase.from('exercises').update({ is_archived: false }).eq('id', id);
  if (error) throw error;
}

export async function deleteExercise(id: string): Promise<void> {
  const { error } = await supabase.from('exercises').delete().eq('id', id);
  if (error) {
    if (error.code === '23503') {
      throw new Error(
        'No se puede eliminar: ya tiene series registradas o está en alguna rutina. Usá "Archivar" en su lugar.',
      );
    }
    throw error;
  }
}
