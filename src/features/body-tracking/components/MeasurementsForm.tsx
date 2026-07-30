import { useState, type FormEvent } from 'react';
import { Button, Input, Select } from '../../../components/ui';
import { METRIC_LABEL_OPTIONS } from '../../../lib/utils/bodyMetrics';
import type { Database } from '../../../types/database';

type BodyMetricInsert = Database['public']['Tables']['body_metrics']['Insert'];
type MeasurementInput = Omit<BodyMetricInsert, 'user_id'>;

interface MeasurementsFormProps {
  onSubmit: (input: MeasurementInput) => void;
  submitting?: boolean;
}

const FIELDS: { key: keyof MeasurementInput; label: string }[] = [
  { key: 'weight_kg', label: 'Peso (kg)' },
  { key: 'body_fat_pct', label: '% graso' },
  { key: 'neck_cm', label: 'Cuello (cm)' },
  { key: 'shoulders_cm', label: 'Hombros (cm)' },
  { key: 'chest_cm', label: 'Pecho (cm)' },
  { key: 'biceps_cm', label: 'Bíceps (cm)' },
  { key: 'waist_cm', label: 'Cintura (cm)' },
  { key: 'hips_cm', label: 'Cadera (cm)' },
  { key: 'quads_cm', label: 'Cuádriceps (cm)' },
  { key: 'calves_cm', label: 'Pantorrillas (cm)' },
];

export function MeasurementsForm({ onSubmit, submitting }: MeasurementsFormProps) {
  const [label, setLabel] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const input: Record<string, unknown> = { label: label || null };
    for (const field of FIELDS) {
      input[field.key] = values[field.key] ? Number(values[field.key]) : null;
    }
    onSubmit(input as MeasurementInput);
    setLabel('');
    setValues({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Select
        options={METRIC_LABEL_OPTIONS}
        placeholder="Sin etiqueta (medición libre)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((field) => (
          <Input
            key={field.key}
            type="number"
            placeholder={field.label}
            value={values[field.key] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
          />
        ))}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Guardando…' : 'Guardar medidas'}
      </Button>
    </form>
  );
}
