import type { DayFormat } from '../../types/database';

export const DAY_FORMATS: DayFormat[] = ['tradicional', 'intervalos'];

export const DAY_FORMAT_LABELS: Record<DayFormat, string> = {
  tradicional: 'Tradicional',
  intervalos: 'Intervalos',
};

// Duraciones típicas de un día de intervalos (30/40/45'), a modo de acceso
// rápido en el builder — el campo sigue siendo un número libre por si la
// profe carga otro valor.
export const INTERVAL_DURATION_PRESETS = [30, 40, 45];
