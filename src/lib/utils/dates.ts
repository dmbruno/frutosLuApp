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
