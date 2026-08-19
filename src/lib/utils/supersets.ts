// Agrupa ejercicios consecutivos que comparten superset_group (A1+A2 = superserie "A").
// Ejercicios sin superset_group quedan como su propio grupo de un solo elemento.
export function groupBySuperset<T extends { superset_group: string | null }>(exercises: T[]): T[][] {
  const groups: T[][] = [];
  const seenGroups = new Set<string>();
  for (const exercise of exercises) {
    if (exercise.superset_group) {
      if (seenGroups.has(exercise.superset_group)) continue;
      seenGroups.add(exercise.superset_group);
      groups.push(exercises.filter((e) => e.superset_group === exercise.superset_group));
    } else {
      groups.push([exercise]);
    }
  }
  return groups;
}
