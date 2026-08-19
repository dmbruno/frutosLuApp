// La profe carga los nombres de ejercicio en mayúsculas ("SENTADILLA SUMO CON DB").
// Se guarda así tal cual, pero para lectura se muestra en oración: "Sentadilla sumo con db".
export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`;
}

export function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00`).toLocaleDateString('es-AR');
}

// "hace 2h", "hace 3 días" — para timestamps recientes (feeds de actividad).
export function formatRelativeTime(value: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'recién';
  if (minutes < 60) return `hace ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
}
