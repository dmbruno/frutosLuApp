import type { ProgramExerciseWithExercise } from '../../types/domain';

// Si TODOS los ejercicios del bloque comparten el mismo parsed_sets (ej. todos "3X..."),
// se puede mostrar "3 series" una sola vez arriba del bloque en vez de repetirlo por fila.
export function getUniformSets(exercises: ProgramExerciseWithExercise[]): number | null {
  const first = exercises[0]?.parsed_sets;
  if (!first) return null;
  return exercises.every((e) => e.parsed_sets === first) ? first : null;
}

// Series a mostrar en el encabezado del bloque/superserie: el valor uniforme si todos
// comparten parsed_sets, o si no, el mayor parsed_sets del grupo (nunca se oculta el ícono
// solo porque un ejercicio tenga menos series que otro dentro del mismo bloque).
export function getDisplaySets(exercises: ProgramExerciseWithExercise[]): number | null {
  const uniform = getUniformSets(exercises);
  if (uniform) return uniform;
  return exercises.reduce<number | null>((max, e) => {
    if (!e.parsed_sets) return max;
    return max === null || e.parsed_sets > max ? e.parsed_sets : max;
  }, null);
}

// Saca el prefijo "{sets}X" de sets_reps_text para no repetirlo en la fila
// cuando ya se muestra una vez en el badge del bloque. Si no matchea el
// prefijo esperado, devuelve el texto tal cual (nunca rompe el dato de la profe).
export function stripSetsPrefix(text: string, sets: number): string {
  const match = text.match(new RegExp(`^\\s*${sets}\\s*X\\s*`, 'i'));
  return match ? text.slice(match[0].length).trim() : text;
}
