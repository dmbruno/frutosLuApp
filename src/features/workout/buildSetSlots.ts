import type { ProgramExerciseWithExercise } from '../../types/domain';

export interface SetSlot {
  setNumber: number;
  label: string;
}

// "3X10" → 3 filas ("Serie 1/2/3"). "3X5/5" también son 3 filas: ambos lados
// se hacen dentro de la misma serie, un solo check por serie (no se separa
// Derecho/Izquierdo en filas distintas).
export function buildSetSlots(exercise: ProgramExerciseWithExercise): SetSlot[] {
  const numSets = exercise.parsed_sets ?? 3;
  return Array.from({ length: numSets }, (_, i) => ({ setNumber: i + 1, label: `Serie ${i + 1}` }));
}
