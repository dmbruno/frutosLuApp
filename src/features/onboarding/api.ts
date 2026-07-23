import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface OnboardingData {
  full_name: string;
  birth_date: string | null;
  sex: string | null;
  athlete_profile: string | null;
  experience_level: string | null;
  goal: string | null;
  injuries_notes: string | null;
}

export async function completeOnboarding(userId: string, data: OnboardingData): Promise<void> {
  const update: ProfileUpdate = { ...data, onboarding_done: true };
  const { error } = await supabase.from('profiles').update(update).eq('id', userId);
  if (error) throw error;
}
