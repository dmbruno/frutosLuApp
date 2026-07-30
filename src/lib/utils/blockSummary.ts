import type { ProgramExerciseWithExercise } from '../../types/domain';

// Si TODOS los ejercicios del bloque comparten el mismo parsed_sets (ej. todos "3X..."),
// se puede mostrar "3 series" una sola vez arriba del bloque en vez de repetirlo por fila.
export function getUniformSets(exercises: ProgramExerciseWithExercise[]): number | null {
  const first = exercises[0]?.parsed_sets;
  if (!first) return null;
  return exercises.every((e) => e.parsed_sets === first) ? first : null;
}

// Saca el prefijo "{sets}X" de sets_reps_text para no repetirlo en la fila
// cuando ya se muestra una vez en el badge del bloque. Si no matchea el
// prefijo esperado, devuelve el texto tal cual (nunca rompe el dato de la profe).
export function stripSetsPrefix(text: string, sets: number): string {
  const match = text.match(new RegExp(`^\\s*${sets}\\s*X\\s*`, 'i'));
  return match ? text.slice(match[0].length).trim() : text;
}
