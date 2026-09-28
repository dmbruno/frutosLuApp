import type { ExerciseBlock, ExerciseKind, MuscleGroup } from '../../types/database';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'pecho', 'espalda', 'hombros', 'biceps', 'triceps', 'antebrazos',
  'cuadriceps', 'isquiotibiales', 'gluteos', 'gemelos',
  'abductores', 'aductores',
  'abdominales', 'lumbares', 'cardio', 'cuerpo_completo',
];

export const EXERCISE_KINDS: ExerciseKind[] = [
  'fuerza', 'cardio', 'movilidad', 'activacion', 'potencia', 'pliometria', 'sprint',
];

export const EXERCISE_BLOCKS: ExerciseBlock[] = [
  'movilidad', 'core', 'estructura', 'cardio', 'otro', 'activacion', 'potencia', 'pliometria', 'sprint',
];

// Fuente única de las etiquetas en español: Record<Enum, string> obliga a
// TypeScript a fallar el build si falta traducir un valor nuevo del enum.
export const KIND_LABELS: Record<ExerciseKind, string> = {
  fuerza: 'Fuerza',
  cardio: 'Cardio',
  movilidad: 'Movilidad',
  activacion: 'Activación',
  potencia: 'Potencia',
  pliometria: 'Pliometría',
  sprint: 'Sprint',
};

export const BLOCK_LABELS: Record<ExerciseBlock, string> = {
  movilidad: 'Movilidad',
  core: 'Core',
  estructura: 'Estructura',
  cardio: 'Cardio',
  otro: 'Otro',
  activacion: 'Activación',
  potencia: 'Potencia',
  pliometria: 'Pliometría',
  sprint: 'Sprint',
};

export const EQUIPMENT_OPTIONS = [
  'BARRA LIBRE',
  'SMITH/GUIA',
  'KETTLEBELL',
  'DOBLE KETTLEBELL',
  'MANCUERNA',
  'DOBLE MANCUERNA',
  'BANDA CORTA',
  'BANDA LARGA',
  'SANDBAG',
  'POLEA',
  'POLEA DOBLE',
] as const;
