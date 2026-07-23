import { ATHLETE_PROFILE_OPTIONS, EXPERIENCE_OPTIONS } from '../../../lib/utils/profileLabels';
import type { OnboardingData } from '../api';

interface StepAthleteProfileProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
}

export function StepAthleteProfile({ data, onChange }: StepAthleteProfileProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Perfil deportivo</p>
        <div className="grid grid-cols-2 gap-2">
          {ATHLETE_PROFILE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ athlete_profile: opt.value })}
              className={`rounded-xl border px-3 py-3 text-sm font-medium ${
                data.athlete_profile === opt.value
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-neutral-300 text-neutral-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Nivel de experiencia</p>
        <div className="flex gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ experience_level: opt.value })}
              className={`flex-1 rounded-xl border px-3 py-3 text-sm font-medium ${
                data.experience_level === opt.value
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-neutral-300 text-neutral-500'
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
