import { EmptyState } from '../../../components/ui';
import type { BodyMetric } from '../../../types/domain';

interface MeasurementHistoryProps {
  measurements: BodyMetric[] | undefined;
}

const FIELDS: { key: keyof BodyMetric; label: string; unit: string }[] = [
  { key: 'weight_kg', label: 'Peso', unit: 'kg' },
  { key: 'body_fat_pct', label: '% graso', unit: '%' },
  { key: 'neck_cm', label: 'Cuello', unit: 'cm' },
  { key: 'shoulders_cm', label: 'Hombros', unit: 'cm' },
  { key: 'chest_cm', label: 'Pecho', unit: 'cm' },
  { key: 'biceps_cm', label: 'Bíceps', unit: 'cm' },
  { key: 'waist_cm', label: 'Cintura', unit: 'cm' },
  { key: 'hips_cm', label: 'Cadera', unit: 'cm' },
  { key: 'quads_cm', label: 'Cuádriceps', unit: 'cm' },
  { key: 'calves_cm', label: 'Pantorrillas', unit: 'cm' },
];

export function MeasurementHistory({ measurements }: MeasurementHistoryProps) {
  if (!measurements || measurements.length === 0) {
    return <EmptyState title="Sin medidas cargadas" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {measurements.map((m) => {
        const values = FIELDS.filter((f) => m[f.key] != null);
        return (
          <div key={m.id} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-neutral-800">{m.label || 'Medición'}</span>
              <span className="text-xs text-neutral-400">{new Date(m.measured_on).toLocaleDateString('es-AR')}</span>
            </div>
            {values.length === 0 ? (
              <p className="text-sm text-neutral-400">Sin datos numéricos.</p>
            ) : (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {values.map((f) => (
                  <div key={f.key} className="flex justify-between gap-2">
                    <dt className="text-neutral-400">{f.label}</dt>
                    <dd className="font-medium text-neutral-700">
                      {m[f.key]}
                      {f.unit}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {m.note && <p className="mt-2 text-xs text-neutral-500">{m.note}</p>}
          </div>
        );
      })}
    </div>
  );
}
