export function calculateSetVolume(weightKg: number | null, reps: number | null): number {
  if (weightKg == null || reps == null) return 0;
  return weightKg * reps;
}
