import { supabase } from '../../lib/supabase';
import { isBirthdayWithinDays, mondayOf } from '../../lib/utils/dates';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// ============ Actividad reciente (feed + alertas) ============

export interface RecentSession {
  id: string;
  userId: string;
  fullName: string;
  startedAt: string;
  finishedAt: string;
  feeling: number | null;
  athleteNote: string | null;
}

export async function getRecentActivity(): Promise<RecentSession[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id, user_id, started_at, finished_at, feeling, athlete_note, profiles!inner(full_name, role)')
    .not('finished_at', 'is', null)
    .gte('finished_at', daysAgoIso(7))
    .order('finished_at', { ascending: false })
    .limit(30);
  if (error) throw error;

  return (data ?? [])
    .filter((s) => s.profiles.role === 'alumno')
    .map((s) => ({
      id: s.id,
      userId: s.user_id,
      fullName: s.profiles.full_name,
      startedAt: s.started_at,
      finishedAt: s.finished_at!,
      feeling: s.feeling,
      athleteNote: s.athlete_note,
    }));
}

// ============ PRs recientes ============

export interface RecentPR {
  userId: string;
  fullName: string;
  exerciseName: string;
  weightKg: number;
  loggedAt: string;
}

export async function getRecentPRs(): Promise<RecentPR[]> {
  const since = daysAgoIso(7);

  // set_logs no tiene user_id propio — el alumno se llega a través de
  // session_id -> workout_sessions.user_id. El !inner permite filtrar por esa
  // relación embebida en vez de solo traerla.
  const { data: recent, error } = await supabase
    .from('set_logs')
    .select(
      'exercise_id, weight_kg, logged_at, workout_sessions!inner(user_id, profiles!inner(full_name)), exercises!inner(name)',
    )
    .not('weight_kg', 'is', null)
    .gte('logged_at', since);
  if (error) throw error;

  interface Candidate {
    userId: string;
    exerciseId: string;
    fullName: string;
    exerciseName: string;
    weight: number;
    loggedAt: string;
  }

  const bestThisWeek = new Map<string, Candidate>();
  for (const row of recent ?? []) {
    const userId = row.workout_sessions.user_id;
    const key = `${userId}:${row.exercise_id}`;
    const weight = row.weight_kg!;
    const existing = bestThisWeek.get(key);
    if (!existing || weight > existing.weight) {
      bestThisWeek.set(key, {
        userId,
        exerciseId: row.exercise_id,
        fullName: row.workout_sessions.profiles.full_name,
        exerciseName: row.exercises.name,
        weight,
        loggedAt: row.logged_at,
      });
    }
  }

  const results: RecentPR[] = [];
  for (const candidate of bestThisWeek.values()) {
    const { data: prior, error: priorError } = await supabase
      .from('set_logs')
      .select('weight_kg, workout_sessions!inner(user_id)')
      .eq('workout_sessions.user_id', candidate.userId)
      .eq('exercise_id', candidate.exerciseId)
      .not('weight_kg', 'is', null)
      .lt('logged_at', since)
      .order('weight_kg', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (priorError) throw priorError;

    if (candidate.weight > (prior?.weight_kg ?? 0)) {
      results.push({
        userId: candidate.userId,
        fullName: candidate.fullName,
        exerciseName: candidate.exerciseName,
        weightKg: candidate.weight,
        loggedAt: candidate.loggedAt,
      });
    }
  }

  return results.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
}

// ============ Novedades: cumpleaños + alumnos nuevos ============

export interface StudentHighlight {
  id: string;
  fullName: string;
}

export interface WeeklyHighlights {
  birthdays: StudentHighlight[];
  newStudents: StudentHighlight[];
}

export async function getWeeklyHighlights(): Promise<WeeklyHighlights> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, birth_date, created_at')
    .eq('role', 'alumno');
  if (error) throw error;

  const sevenDaysAgo = new Date(daysAgoIso(7));

  const birthdays = (data ?? []).filter((p) => p.birth_date && isBirthdayWithinDays(p.birth_date, 7));
  const newStudents = (data ?? []).filter((p) => new Date(p.created_at) >= sevenDaysAgo);

  return {
    birthdays: birthdays.map((p) => ({ id: p.id, fullName: p.full_name })),
    newStudents: newStudents.map((p) => ({ id: p.id, fullName: p.full_name })),
  };
}

// ============ Tendencia de adherencia grupal (8 semanas) ============

export interface WeeklyAdherencePoint {
  weekStart: string;
  sessions: number;
}

export async function getWeeklyAdherenceTrend(): Promise<WeeklyAdherencePoint[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('started_at, profiles!inner(role)')
    .not('finished_at', 'is', null)
    .gte('started_at', daysAgoIso(8 * 7));
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const s of data ?? []) {
    if (s.profiles.role !== 'alumno') continue;
    const week = mondayOf(new Date(s.started_at));
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }

  const points: WeeklyAdherencePoint[] = [];
  const currentMonday = mondayOf(new Date());
  for (let i = 7; i >= 0; i--) {
    const d = new Date(`${currentMonday}T00:00:00`);
    d.setDate(d.getDate() - i * 7);
    const key = mondayOf(d);
    points.push({ weekStart: key, sessions: counts.get(key) ?? 0 });
  }
  return points;
}

// ============ Distribución por perfil deportivo ============

export interface ProfileDistributionPoint {
  profile: string;
  count: number;
}

export async function getProfileDistribution(): Promise<ProfileDistributionPoint[]> {
  const { data, error } = await supabase.from('profiles').select('athlete_profile').eq('role', 'alumno');
  if (error) throw error;

  const counts = new Map<string, number>();
  for (const p of data ?? []) {
    const key = p.athlete_profile ?? 'sin_definir';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([profile, count]) => ({ profile, count }));
}
