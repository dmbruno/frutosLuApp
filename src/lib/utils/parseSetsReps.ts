export type RepUnit = 'reps' | 'seg' | 'min' | 'total' | 'rango' | null;

export interface ParsedSetsReps {
  sets: number | null;
  reps: number | null;
  isPerSide: boolean;
  unit: RepUnit;
}

export function parseSetsReps(_text: string): ParsedSetsReps {
  return { sets: null, reps: null, isPerSide: false, unit: null };
}
