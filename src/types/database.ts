// Tipado a mano contra supabase/migrations/0001_initial_schema.sql, mientras no
// haya proyecto Supabase linkeado con Docker corriendo. Regenerar con:
//   supabase gen types typescript --project-id <project-ref> > src/types/database.ts
// (o --linked, tras `supabase link`). A partir de ahí, NUNCA editar a mano.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'admin' | 'alumno';
export type SubStatus = 'active' | 'inactive';
export type MuscleGroup =
  | 'pecho' | 'espalda' | 'hombros' | 'biceps' | 'triceps' | 'antebrazos'
  | 'cuadriceps' | 'isquiotibiales' | 'gluteos' | 'gemelos'
  | 'abdominales' | 'lumbares' | 'cardio' | 'cuerpo_completo';
export type ExerciseKind = 'fuerza' | 'cardio' | 'movilidad';
export type ExerciseBlock = 'movilidad' | 'core' | 'estructura' | 'cardio' | 'otro';
export type SetType = 'normal' | 'calentamiento' | 'fallo' | 'drop';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          birth_date: string | null;
          sex: string | null;
          athlete_profile: string | null;
          subscription_status: SubStatus;
          subscription_expires_at: string | null;
          injuries_notes: string | null;
          experience_level: string | null;
          goal: string | null;
          onboarding_done: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          birth_date?: string | null;
          sex?: string | null;
          athlete_profile?: string | null;
          subscription_status?: SubStatus;
          subscription_expires_at?: string | null;
          injuries_notes?: string | null;
          experience_level?: string | null;
          goal?: string | null;
          onboarding_done?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          kind: ExerciseKind;
          default_block: ExerciseBlock | null;
          primary_muscle: MuscleGroup;
          secondary_muscles: MuscleGroup[];
          instructions: string | null;
          video_url: string | null;
          needs_filming: boolean;
          equipment: string | null;
          is_archived: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          kind?: ExerciseKind;
          default_block?: ExerciseBlock | null;
          primary_muscle: MuscleGroup;
          secondary_muscles?: MuscleGroup[];
          instructions?: string | null;
          video_url?: string | null;
          needs_filming?: boolean;
          equipment?: string | null;
          is_archived?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
      };
      programs: {
        Row: {
          id: string;
          user_id: string | null;
          template_id: string | null;
          name: string;
          notes: string | null;
          starts_on: string | null;
          duration_weeks: number | null;
          is_active: boolean;
          cycle_pattern: number[] | null;
          total_weeks: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          template_id?: string | null;
          name: string;
          notes?: string | null;
          starts_on?: string | null;
          duration_weeks?: number | null;
          is_active?: boolean;
          cycle_pattern?: number[] | null;
          total_weeks?: number | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['programs']['Insert']>;
      };
      program_days: {
        Row: {
          id: string;
          program_id: string;
          week_number: number;
          title: string;
          position: number;
          weekday: number | null;
        };
        Insert: {
          id?: string;
          program_id: string;
          week_number?: number;
          title: string;
          position: number;
          weekday?: number | null;
        };
        Update: Partial<Database['public']['Tables']['program_days']['Insert']>;
      };
      program_exercises: {
        Row: {
          id: string;
          program_day_id: string;
          exercise_id: string;
          block: ExerciseBlock;
          order_code: string | null;
          position: number;
          sets_reps_text: string;
          parsed_sets: number | null;
          parsed_reps: number | null;
          is_per_side: boolean;
          rep_unit: string | null;
          suggested_weight_kg: number | null;
          rest_sec: number | null;
          superset_group: string | null;
          coach_note: string | null;
        };
        Insert: {
          id?: string;
          program_day_id: string;
          exercise_id: string;
          block?: ExerciseBlock;
          order_code?: string | null;
          position: number;
          sets_reps_text: string;
          parsed_sets?: number | null;
          parsed_reps?: number | null;
          is_per_side?: boolean;
          rep_unit?: string | null;
          suggested_weight_kg?: number | null;
          rest_sec?: number | null;
          superset_group?: string | null;
          coach_note?: string | null;
        };
        Update: Partial<Database['public']['Tables']['program_exercises']['Insert']>;
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          program_day_id: string | null;
          started_at: string;
          finished_at: string | null;
          feeling: number | null;
          athlete_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_day_id?: string | null;
          started_at?: string;
          finished_at?: string | null;
          feeling?: number | null;
          athlete_note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['workout_sessions']['Insert']>;
      };
      set_logs: {
        Row: {
          id: string;
          session_id: string;
          program_exercise_id: string | null;
          exercise_id: string;
          set_number: number;
          set_type: SetType;
          weight_kg: number | null;
          reps: number | null;
          duration_sec: number | null;
          distance_m: number | null;
          logged_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          program_exercise_id?: string | null;
          exercise_id: string;
          set_number: number;
          set_type?: SetType;
          weight_kg?: number | null;
          reps?: number | null;
          duration_sec?: number | null;
          distance_m?: number | null;
          logged_at?: string;
        };
        Update: Partial<Database['public']['Tables']['set_logs']['Insert']>;
      };
      body_metrics: {
        Row: {
          id: string;
          user_id: string;
          measured_on: string;
          label: string | null;
          weight_kg: number | null;
          body_fat_pct: number | null;
          neck_cm: number | null;
          shoulders_cm: number | null;
          chest_cm: number | null;
          biceps_cm: number | null;
          waist_cm: number | null;
          hips_cm: number | null;
          quads_cm: number | null;
          calves_cm: number | null;
          note: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          measured_on?: string;
          label?: string | null;
          weight_kg?: number | null;
          body_fat_pct?: number | null;
          neck_cm?: number | null;
          shoulders_cm?: number | null;
          chest_cm?: number | null;
          biceps_cm?: number | null;
          waist_cm?: number | null;
          hips_cm?: number | null;
          quads_cm?: number | null;
          calves_cm?: number | null;
          note?: string | null;
        };
        Update: Partial<Database['public']['Tables']['body_metrics']['Insert']>;
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          taken_on: string;
          pose: string | null;
          stage: string | null;
          storage_path: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          taken_on?: string;
          pose?: string | null;
          stage?: string | null;
          storage_path: string;
        };
        Update: Partial<Database['public']['Tables']['progress_photos']['Insert']>;
      };
    };
    Views: {
      v_adherence: {
        Row: {
          user_id: string;
          full_name: string;
          subscription_status: SubStatus;
          last_workout_at: string | null;
          traffic_light: 'verde' | 'amarillo' | 'rojo';
          sessions_7d: number;
        };
      };
    };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_active_sub: { Args: Record<PropertyKey, never>; Returns: boolean };
      parse_sets_reps: {
        Args: { txt: string };
        Returns: { p_sets: number | null; p_reps: number | null; p_per_side: boolean; p_unit: string | null }[];
      };
      assign_template: {
        Args: { p_template_id: string; p_user_id: string; p_starts_on: string };
        Returns: string;
      };
      muscle_volume: {
        Args: { p_user: string; p_from: string; p_to: string };
        Returns: { muscle: MuscleGroup; volume_kg: number }[];
      };
    };
    Enums: {
      user_role: UserRole;
      sub_status: SubStatus;
      muscle_group: MuscleGroup;
      exercise_kind: ExerciseKind;
      exercise_block: ExerciseBlock;
      set_type: SetType;
    };
  };
}
