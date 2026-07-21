import { supabase } from '../../lib/supabase';
import { currentProgramWeek } from '../../lib/utils/dates';
import type { Database } from '../../types/database';
import type { DayWithExercises, WeekDay } from '../../types/domain';

type WorkoutSessionInsert = Database['public']['Tables']['workout_sessions']['Insert'];
type SetLogInsert = Database['public']['Tables']['set_logs']['Insert'];

async function getCurrentWeekDays(userId: string): Promise<WeekDay[]> {
  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();
  if (programError) throw programError;
  if (!program || !program.starts_on) return [];

  const week = currentProgramWeek(program.starts_on);

  const { data: days, error: daysError } = await supabase
    .from('program_days')
    .select('*, program_exercises(*, exercises(*))')
    .eq('program_id', program.id)
    .eq('week_number', week)
    .order('position', { ascending: true });
  if (daysError) throw daysError;
  if (!days || days.length === 0) return [];

  const dayIds = days.map((d) => d.id);
  const { data: sessions, error: sessionsError } = await supabase
    .from('workout_sessions')
    .select('program_day_id')
    .eq('user_id', userId)
    .in('program_day_id', dayIds)
    .not('finished_at', 'is', null);
  if (sessionsError) throw sessionsError;
  const completedIds = new Set((sessions ?? []).map((s) => s.program_day_id));

  return days.map((day) => {
    const { program_exercises, ...rest } = day;
    return {
      ...rest,
      completed: completedIds.has(day.id),
      exercises: [...program_exercises]
        .sort((a, b) => a.position - b.position)
        .map(({ exercises, ...pe }) => ({ ...pe, exercise: exercises })),
    };
  });
}

export async function getTodayWorkout(userId: string): Promise<WeekDay | null> {
  const days = await getCurrentWeekDays(userId);
  if (days.length === 0) return null;
  return days.find((d) => !d.completed) ?? days[days.length - 1];
}

export async function getWeekView(userId: string): Promise<WeekDay[]> {
  return getCurrentWeekDays(userId);
}

export async function getProgramDay(programDayId: string): Promise<DayWithExercises> {
  const { data, error } = await supabase
    .from('program_days')
    .select('*, program_exercises(*, exercises(*))')
    .eq('id', programDayId)
    .single();
  if (error) throw error;

  const { program_exercises, ...rest } = data;
  return {
    ...rest,
    exercises: [...program_exercises]
      .sort((a, b) => a.position - b.position)
      .map(({ exercises, ...pe }) => ({ ...pe, exercise: exercises })),
  };
}

export async function startSession(userId: string, programDayId: string) {
  const { data: existing, error: existingError } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('program_day_id', programDayId)
    .is('finished_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing;

  const insert: WorkoutSessionInsert = { user_id: userId, program_day_id: programDayId };
  const { data, error } = await supabase.from('workout_sessions').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function finishSession(sessionId: string, feeling: number, note: string | null) {
  const { data, error } = await supabase
    .from('workout_sessions')
    .update({ finished_at: new Date().toISOString(), feeling, athlete_note: note })
    .eq('id', sessionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function logSet(setLog: SetLogInsert) {
  const { data, error } = await supabase.from('set_logs').insert(setLog).select().single();
  if (error) throw error;
  return data;
}

export async function getSessionSummary(sessionId: string, startedAt: string) {
  const { data, error } = await supabase.from('set_logs').select('weight_kg, reps').eq('session_id', sessionId);
  if (error) throw error;

  const totalVolumeKg = (data ?? []).reduce((sum, s) => {
    if (s.weight_kg == null || s.reps == null) return sum;
    return sum + s.weight_kg * s.reps;
  }, 0);
  const totalSets = data?.length ?? 0;
  const durationMin = Math.max(1, Math.round((Date.now() - new Date(startedAt).getTime()) / 60_000));

  return { totalVolumeKg, totalSets, durationMin };
}

export async function getLastPerformances(
  programExerciseId: string,
): Promise<Record<number, { weight_kg: number | null; reps: number | null }>> {
  const { data, error } = await supabase
    .from('set_logs')
    .select('set_number, weight_kg, reps, logged_at')
    .eq('program_exercise_id', programExerciseId)
    .order('logged_at', { ascending: false });
  if (error) throw error;

  const result: Record<number, { weight_kg: number | null; reps: number | null }> = {};
  for (const row of data ?? []) {
    if (!(row.set_number in result)) {
      result[row.set_number] = { weight_kg: row.weight_kg, reps: row.reps };
    }
  }
  return result;
}
