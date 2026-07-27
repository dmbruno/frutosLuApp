import { Card, Spinner } from '../../../components/ui';
import type { Adherence } from '../../../types/domain';

interface AdherenceKpiProps {
  students: Adherence[] | undefined;
  loading: boolean;
}

export function AdherenceKpi({ students, loading }: AdherenceKpiProps) {
  if (loading) return <Spinner />;

  const active = (students ?? []).filter((s) => s.subscription_status === 'active');
  const trained = active.filter((s) => s.sessions_7d > 0);
  const pct = active.length === 0 ? 0 : Math.round((trained.length / active.length) * 100);

  return (
    <Card className="flex flex-col items-center gap-1 py-6 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:py-5">
      <span className="font-display text-4xl font-bold text-brand-pink sm:text-3xl">{pct}%</span>
      <span className="text-sm text-neutral-500">
        de tus alumnos activos entrenó esta semana
        <br className="hidden sm:block" /> ({trained.length} de {active.length})
      </span>
    </Card>
  );
}
