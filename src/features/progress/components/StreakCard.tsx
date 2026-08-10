import { Flame } from 'lucide-react';

interface StreakCardProps {
  weeks: number | undefined;
  loading: boolean;
}

export function StreakCard({ weeks, loading }: StreakCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center">
      <p className="flex items-center justify-center gap-1 font-display text-2xl font-extrabold text-neutral-900">
        <Flame size={20} className="text-brand-pink" fill="currentColor" />
        {loading ? '—' : (weeks ?? 0)}
      </p>
      <p className="text-sm text-neutral-500">{weeks === 1 ? 'semana seguida' : 'semanas seguidas'}</p>
    </div>
  );
}
