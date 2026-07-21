interface StreakCardProps {
  weeks: number | undefined;
  loading: boolean;
}

export function StreakCard({ weeks, loading }: StreakCardProps) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="font-display text-2xl font-semibold text-brand-pink">{loading ? '—' : (weeks ?? 0)}</p>
      <p className="text-sm text-neutral-500">{weeks === 1 ? 'semana seguida' : 'semanas seguidas'}</p>
    </div>
  );
}
