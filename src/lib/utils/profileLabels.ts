interface LabelOption {
  value: string;
  label: string;
}

export const SEX_OPTIONS: LabelOption[] = [
  { value: 'F', label: 'Femenino' },
  { value: 'M', label: 'Masculino' },
  { value: 'X', label: 'Prefiero no decir' },
];

export const ATHLETE_PROFILE_OPTIONS: LabelOption[] = [
  { value: 'runner', label: 'Corredora' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'postparto', label: 'Postparto' },
  { value: 'libre', label: 'Entrenamiento general' },
];

export const EXPERIENCE_OPTIONS: LabelOption[] = [
  { value: 'inicial', label: 'Inicial' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

export function findLabel(options: LabelOption[], value: string | null): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? value;
}
