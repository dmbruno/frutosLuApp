import { supabase } from '../../lib/supabase';
import { compressImage } from '../../lib/utils/compressImage';
import type { Database } from '../../types/database';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface EditableOwnProfileFields {
  full_name: string;
  sex: string | null;
  birth_date: string | null;
  athlete_profile: string | null;
  experience_level: string | null;
  goal: string | null;
  injuries_notes: string | null;
}

export async function updateOwnProfile(userId: string, input: EditableOwnProfileFields): Promise<void> {
  const update: ProfileUpdate = input;
  const { error } = await supabase.from('profiles').update(update).eq('id', userId);
  if (error) throw error;
}

const AVATAR_BUCKET = 'avatars';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const compressed = await compressImage(file, { maxWidth: 512, maxHeight: 512 });
  const path = `${userId}/avatar.jpg`;
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, compressed, { upsert: true });
  if (uploadError) throw uploadError;

  const publicUrl = `${supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl}?t=${Date.now()}`;
  const { error } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
  if (error) throw error;
  return publicUrl;
}
