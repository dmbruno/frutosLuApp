export function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`;
}

export function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-AR');
}
