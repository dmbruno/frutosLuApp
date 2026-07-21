import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';
import type { BodyMetric, ProgressPhoto } from '../../types/domain';

type BodyMetricInsert = Database['public']['Tables']['body_metrics']['Insert'];

const PHOTOS_BUCKET = 'progress-photos';

export async function listMeasurements(userId: string): Promise<BodyMetric[]> {
  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('measured_on', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addMeasurement(input: BodyMetricInsert): Promise<BodyMetric> {
  const { data, error } = await supabase.from('body_metrics').insert(input).select().single();
  if (error) throw error;
  return data;
}

export interface ProgressPhotoWithUrl extends ProgressPhoto {
  url: string | null;
}

export async function uploadProgressPhoto(
  userId: string,
  file: File,
  pose: string,
  stage: string,
): Promise<ProgressPhoto> {
  const path = `${userId}/${Date.now()}-${pose}-${stage}.jpg`;
  const { error: uploadError } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file);
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({ user_id: userId, storage_path: path, pose, stage })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listPhotos(userId: string): Promise<ProgressPhotoWithUrl[]> {
  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .order('taken_on', { ascending: false });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (photo) => {
      const { data: signed } = await supabase.storage
        .from(PHOTOS_BUCKET)
        .createSignedUrl(photo.storage_path, 60 * 60);
      return { ...photo, url: signed?.signedUrl ?? null };
    }),
  );
}
