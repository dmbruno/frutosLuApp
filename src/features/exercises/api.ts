import { supabase } from '../../lib/supabase';
import type { Exercise } from '../../types/domain';
import type { Database } from '../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type ExerciseUpdate = Database['public']['Tables']['exercises']['Update'];

export async function listExercises(search?: string): Promise<Exercise[]> {
  let query = supabase.from('exercises').select('*').eq('is_archived', false).order('name');
  if (search) {
    query = query.ilike('name', `%${search}%`);
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
