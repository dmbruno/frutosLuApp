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

export async function inviteStudent(email: string, fullName: string, days: number): Promise<void> {
  const { data, error } = await supabase.functions.invoke('invite-student', {
    body: { email, full_name: fullName, days },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}

export async function renewSubscription(userId: string, days: number): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_expires_at: expiresAt.toISOString().slice(0, 10),
    })
    .eq('id', userId);
  if (error) throw error;
}

export async function getStudentNote(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('student_notes')
    .select('note')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.note ?? '';
}

export async function setStudentNote(userId: string, note: string): Promise<void> {
  const { error } = await supabase
    .from('student_notes')
    .upsert({ user_id: userId, note, updated_at: new Date().toISOString() });
  if (error) throw error;
}
