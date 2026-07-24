import { Input } from '../../../components/ui';
import { SEX_OPTIONS } from '../../../lib/utils/profileLabels';
import type { OnboardingData } from '../api';

interface StepPersonalDataProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}

export function StepPersonalData({ data, onChange }: StepPersonalDataProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Nombre completo</p>
        <Input
          value={data.full_name}
          onChange={(e) => onChange({ full_name: e.target.value })}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Fecha de nacimiento</p>
        <Input
          type="date"
          value={data.birth_date ?? ''}
          onChange={(e) => onChange({ birth_date: e.target.value || null })}
        />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Sexo</p>
        <div className="flex gap-2">
          {SEX_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ sex: opt.value })}
              className={`flex-1 cursor-pointer rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                data.sex === opt.value
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-neutral-300 text-neutral-500 hover:border-brand-pink/40 hover:bg-neutral-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
