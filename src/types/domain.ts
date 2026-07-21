import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type Program = Database['public']['Tables']['programs']['Row'];
export type ProgramDay = Database['public']['Tables']['program_days']['Row'];
export type ProgramExercise = Database['public']['Tables']['program_exercises']['Row'];
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
export type SetLog = Database['public']['Tables']['set_logs']['Row'];
export type BodyMetric = Database['public']['Tables']['body_metrics']['Row'];
export type Adherence = Database['public']['Views']['v_adherence']['Row'];

export interface ProgramExerciseWithExercise extends ProgramExercise {
  exercise: Exercise;
}

export interface DayWithExercises extends ProgramDay {
  exercises: ProgramExerciseWithExercise[];
}

export interface WeekPlan {
  weekNumber: number;
  days: DayWithExercises[];
}

export interface WeekDay extends DayWithExercises {
  completed: boolean;
}

export interface ProgramFull extends Program {
  days: DayWithExercises[];
}

export interface StudentWithAdherence extends Profile {
  last_workout_at: Adherence['last_workout_at'];
  traffic_light: Adherence['traffic_light'];
  sessions_7d: Adherence['sessions_7d'];
}
