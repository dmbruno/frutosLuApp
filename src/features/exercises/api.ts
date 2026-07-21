import { supabase } from '../../lib/supabase';
import type { Exercise } from '../../types/domain';
import type { Database, ExerciseBlock } from '../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type ExerciseUpdate = Database['public']['Tables']['exercises']['Update'];

export async function listExercises(search?: string, block?: ExerciseBlock): Promise<Exercise[]> {
  let query = supabase.from('exercises').select('*').eq('is_archived', false).order('name');
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
