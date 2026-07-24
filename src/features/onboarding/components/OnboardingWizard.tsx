import { useState } from 'react';
import { Button } from '../../../components/ui';
import { useCompleteOnboarding } from '../hooks/useCompleteOnboarding';
import { StepPersonalData } from './StepPersonalData';
import { StepAthleteProfile } from './StepAthleteProfile';
import { StepGoal } from './StepGoal';
import type { OnboardingData } from '../api';

const STEPS = ['Datos personales', 'Perfil deportivo', 'Objetivo'];

interface OnboardingWizardProps {
  userId: string;
  initialFullName: string;
  onDone: () => void;
}

function isStepValid(step: number, data: OnboardingData): boolean {
  if (step === 0) return data.full_name.trim().length > 0 && data.sex !== null;
  if (step === 1) return data.athlete_profile !== null && data.experience_level !== null;
  return true;
}

export function OnboardingWizard({ userId, initialFullName, onDone }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    full_name: initialFullName,
    birth_date: null,
    sex: null,
    athlete_profile: null,
    experience_level: null,
    goal: null,
    injuries_notes: null,
  });
  const { complete, isPending } = useCompleteOnboarding(userId);

  function patch(update: Partial<OnboardingData>) {
    setData((d) => ({ ...d, ...update }));
  }

  async function handleFinish() {
    await complete(data);
    onDone();
  }

  const isLast = step === STEPS.length - 1;
  const canAdvance = isStepValid(step, data);

  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-neutral-50 p-6">
      <div>
        <p className="text-sm text-neutral-500">
          Paso {step + 1} de {STEPS.length} · {STEPS[step]}
        </p>
        <div className="mt-2 flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-pink' : 'bg-neutral-200'}`} />
          ))}
        </div>
      </div>

      <h1 className="font-display text-xl font-semibold text-brand-pink">¡Bienvenido!</h1>

      {step === 0 && <StepPersonalData data={data} onChange={patch} />}
      {step === 1 && <StepAthleteProfile data={data} onChange={patch} />}
      {step === 2 && <StepGoal data={data} onChange={patch} />}

      <div className="mt-auto flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="cursor-pointer rounded-xl border border-neutral-300 px-4 py-3 font-semibold text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            Atrás
          </button>
        )}
        {isLast ? (
          <Button disabled={isPending} onClick={handleFinish} className="flex-1">
            {isPending ? 'Guardando…' : 'Empezar'}
          </Button>
        ) : (
          <Button disabled={!canAdvance} onClick={() => setStep((s) => s + 1)} className="flex-1">
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
