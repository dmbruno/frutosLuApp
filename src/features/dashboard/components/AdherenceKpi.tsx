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
    <div className="grid grid-cols-2 gap-3">
      <Card className="flex flex-col gap-0.5 py-4 text-center">
        <span className="font-display text-3xl font-extrabold text-neutral-900">{pct}%</span>
        <span className="text-xs text-neutral-500">
          entrenó esta semana
          <br />
          ({trained.length} de {active.length})
        </span>
      </Card>
      <Card className="flex flex-col gap-0.5 py-4 text-center">
        <span className="font-display text-3xl font-extrabold text-neutral-900">{active.length}</span>
        <span className="text-xs text-neutral-500">alumnos activos</span>
      </Card>
    </div>
  );
}
