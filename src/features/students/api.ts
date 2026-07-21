import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types/domain';

export async function listStudents(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'alumno').order('full_name');
  if (error) throw error;
  return data;
}

export async function getStudent(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}
