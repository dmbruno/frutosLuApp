import type { ExerciseBlock, ExerciseKind, MuscleGroup } from '../../types/database';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'antebrazos',
  'cuadriceps', 'isquiotibiales', 'gluteos', 'gemelos',
  'abdominales', 'lumbares', 'cardio', 'cuerpo_completo',
];

export const EXERCISE_KINDS: ExerciseKind[] = ['fuerza', 'cardio', 'movilidad'];

export const EXERCISE_BLOCKS: ExerciseBlock[] = ['movilidad', 'core', 'estructura', 'cardio', 'otro'];
