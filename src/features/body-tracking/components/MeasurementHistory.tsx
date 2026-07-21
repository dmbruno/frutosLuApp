import { EmptyState } from '../../../components/ui';
import type { BodyMetric } from '../../../types/domain';

interface MeasurementHistoryProps {
  measurements: BodyMetric[] | undefined;
}

export function MeasurementHistory({ measurements }: MeasurementHistoryProps) {
  if (!measurements || measurements.length === 0) {
    return <EmptyState title="Sin medidas cargadas" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {measurements.map((m) => (
        <div key={m.id} className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{m.label || 'Medición'}</span>
            <span className="text-neutral-400">{new Date(m.measured_on).toLocaleDateString('es-AR')}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
            {m.weight_kg != null && <span>Peso: {m.weight_kg}kg</span>}
            {m.body_fat_pct != null && <span>% graso: {m.body_fat_pct}%</span>}
            {m.waist_cm != null && <span>Cintura: {m.waist_cm}cm</span>}
            {m.hips_cm != null && <span>Cadera: {m.hips_cm}cm</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
