import { supabase } from '../../lib/supabase';
import { mondayOf } from '../../lib/utils/dates';

export type RangeKind = 'week' | 'month' | 'year';

function getRange(kind: RangeKind): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  if (kind === 'week') from.setDate(from.getDate() - 7);
  if (kind === 'month') from.setMonth(from.getMonth() - 1);
  if (kind === 'year') from.setFullYear(from.getFullYear() - 1);
  return { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) };
}

export async function getMuscleVolume(userId: string, range: RangeKind) {
  const { from, to } = getRange(range);
  const { data, error } = await supabase.rpc('muscle_volume', { p_user: userId, p_from: from, p_to: to });
  if (error) throw error;
  return data;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeightKg: number;
  bestSetVolumeKg: number;
}

export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  const { data, error } = await supabase
    .from('set_logs')
    .select('exercise_id, weight_kg, reps, exercises(name)')
    .not('weight_kg', 'is', null)
    .not('reps', 'is', null);
  if (error) throw error;

  const byExercise = new Map<string, PersonalRecord>();
  for (const row of data ?? []) {
    const weight = row.weight_kg ?? 0;
    const volume = weight * (row.reps ?? 0);
    const existing = byExercise.get(row.exercise_id);
    if (!existing) {
      byExercise.set(row.exercise_id, {
        exerciseId: row.exercise_id,
        exerciseName: row.exercises.name,
        maxWeightKg: weight,
        bestSetVolumeKg: volume,
      });
    } else {
      existing.maxWeightKg = Math.max(existing.maxWeightKg, weight);
      existing.bestSetVolumeKg = Math.max(existing.bestSetVolumeKg, volume);
    }
  }
  return [...byExercise.values()].sort((a, b) => b.bestSetVolumeKg - a.bestSetVolumeKg);
}

export async function getStreak(): Promise<number> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('started_at')
    .not('finished_at', 'is', null)
    .order('started_at', { ascending: false });
  if (error) throw error;

  const weeksWithSession = new Set((data ?? []).map((s) => mondayOf(new Date(s.started_at))));

  let streak = 0;
  const cursor = new Date();
  while (weeksWithSession.has(mondayOf(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 7);
  }
  return streak;
}
