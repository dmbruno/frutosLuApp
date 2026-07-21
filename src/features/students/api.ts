import { supabase } from '../../lib/supabase';
import type { Adherence, Profile, WorkoutSession } from '../../types/domain';

export async function listStudents(): Promise<Adherence[]> {
  const { data, error } = await supabase.from('v_adherence').select('*').order('full_name');
  if (error) throw error;
  return data;
}

export async function getStudent(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export interface StudentDetail {
  profile: Profile;
  recentSessions: WorkoutSession[];
}

export async function getStudentDetail(userId: string): Promise<StudentDetail> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  const { data: sessions, error: sessionsError } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(10);
  if (sessionsError) throw sessionsError;

  return { profile, recentSessions: sessions ?? [] };
}

export async function setSubscription(userId: string, status: 'active' | 'inactive'): Promise<void> {
  const { error } = await supabase.from('profiles').update({ subscription_status: status }).eq('id', userId);
  if (error) throw error;
}
