import type { OnboardingData } from '../api';

interface StepGoalProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}

export function StepGoal({ data, onChange }: StepGoalProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">¿Cuál es tu objetivo?</p>
        <textarea
          value={data.goal ?? ''}
          onChange={(e) => onChange({ goal: e.target.value || null })}
          placeholder="Ej: bajar de peso, ganar fuerza, volver a entrenar post embarazo…"
          className="w-full rounded-xl border border-neutral-300 p-3"
          rows={3}
        />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">
          Lesiones o consideraciones (opcional)
        </p>
        <textarea
          value={data.injuries_notes ?? ''}
          onChange={(e) => onChange({ injuries_notes: e.target.value || null })}
          placeholder="Contale a tu profe si tenés alguna lesión o cuidado especial"
          className="w-full rounded-xl border border-neutral-300 p-3"
          rows={3}
        />
      </div>
    </div>
  );
}
