export function currentProgramWeek(startsOn: string, today: Date = new Date()): number {
  const start = new Date(startsOn);
  const diffMs = today.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, diffWeeks + 1);
}

export function daysRemaining(expiresAt: string | null, today: Date = new Date()): number | null {
  if (!expiresAt) return null;
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const expiry = new Date(`${expiresAt}T00:00:00`);
  const diffMs = expiry.getTime() - startOfToday.getTime();
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}

// Lunes de la semana de `date`, como YYYY-MM-DD — clave estable para agrupar
// sesiones por semana calendario.
export function mondayOf(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

// true si el cumpleaños (mes/día de `birthDate`, sin importar el año) cae
// entre hoy y los próximos `days` días, contemplando el cruce de año nuevo.
export function isBirthdayWithinDays(birthDate: string, days: number, today: Date = new Date()): boolean {
  const bd = new Date(`${birthDate}T00:00:00`);
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i <= days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d.getMonth() === bd.getMonth() && d.getDate() === bd.getDate()) return true;
  }
  return false;
}
