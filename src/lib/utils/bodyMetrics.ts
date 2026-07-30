import type { BodyMetric } from '../../types/domain';

export const METRIC_LABEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'INICIO', label: 'Inicio' },
  { value: 'FINAL', label: 'Final' },
];

export const CIRCUMFERENCE_FIELDS: { key: keyof BodyMetric; label: string }[] = [
  { key: 'neck_cm', label: 'Cuello' },
  { key: 'shoulders_cm', label: 'Hombros' },
  { key: 'chest_cm', label: 'Pecho' },
  { key: 'biceps_cm', label: 'Bíceps' },
  { key: 'waist_cm', label: 'Cintura' },
  { key: 'hips_cm', label: 'Cadera' },
  { key: 'quads_cm', label: 'Cuádriceps' },
  { key: 'calves_cm', label: 'Pantorrillas' },
];

// measurements viene ordenado por measured_on desc (ver listMeasurements): toma la más reciente.
// Comparación case-insensitive: datos viejos cargados como texto libre (antes del selector)
// pueden tener "Inicio" en vez de "INICIO" y no deben desaparecer del comparativo.
export function findLatestByLabel(measurements: BodyMetric[] | undefined, label: string): BodyMetric | undefined {
  return measurements?.find((m) => m.label?.trim().toUpperCase() === label);
}
