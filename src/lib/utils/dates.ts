export function currentProgramWeek(startsOn: string, today: Date = new Date()): number {
  const start = new Date(startsOn);
  const diffMs = today.getTime() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, diffWeeks + 1);
}
