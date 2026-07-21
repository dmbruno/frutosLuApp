interface DaysRemainingBadgeProps {
  days: number | null;
}

export function DaysRemainingBadge({ days }: DaysRemainingBadgeProps) {
  if (days === null) {
    return <span className="text-xs text-neutral-400">sin fecha</span>;
  }
  if (days <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Vencido</span>
    );
  }
  const color = days <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{days} días</span>;
}
