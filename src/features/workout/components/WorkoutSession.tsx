import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { Button, EmptyState, Pill, Spinner } from '../../../components/ui';
import { ExerciseStep } from './ExerciseStep';
import { SupersetStep } from './SupersetStep';
import { RestTimer } from './RestTimer';
import { SessionSummary } from './SessionSummary';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useRestTimer } from '../hooks/useRestTimer';
import { groupBySuperset } from '../../../lib/utils/supersets';
import { buildSetSlots } from '../buildSetSlots';

interface WorkoutSessionProps {
  programDayId: string;
}

export function WorkoutSession({ programDayId }: WorkoutSessionProps) {
  const { day, loading, session, sessionLogs, finish } = useWorkoutSession(programDayId);
  const { secondsLeft, start, skip } = useRestTimer();
  const [stepIndex, setStepIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const resumedRef = useRef(false);

  // Al retomar un entrenamiento a medio hacer, arranca en el primer ejercicio
  // con series pendientes en vez de siempre en el ejercicio 1. Las series ya
  // tildadas siguen guardadas en la base (INSERT inmediato en SetRow); esto
  // sólo restaura DÓNDE se había quedado.
  useEffect(() => {
    if (resumedRef.current || !day || !sessionLogs) return;
    resumedRef.current = true;
    const steps = groupBySuperset(day.exercises);
    let resumeIndex = 0;
    for (let i = 0; i < steps.length; i++) {
      resumeIndex = i;
      const complete = steps[i].every(
        (ex) => Object.keys(sessionLogs[ex.id] ?? {}).length >= buildSetSlots(ex).length,
      );
      if (!complete) break;
    }
    setStepIndex(resumeIndex);
  }, [day, sessionLogs]);

  if (loading || !day || !session) return <Spinner />;
  if (day.exercises.length === 0) {
    return <EmptyState title="Día sin ejercicios cargados" />;
  }

  const steps = groupBySuperset(day.exercises);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const isSuperset = step.length > 1;

  function handleNext() {
    if (isLast) {
      setShowSummary(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handlePrevious() {
    if (stepIndex === 0) {
      navigate('/semana');
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function handleExit() {
    navigate('/semana');
  }

  async function handleFinish(feeling: number, note: string | null) {
    await finish(feeling, note);
    navigate('/');
  }

  if (showSummary) {
    return <SessionSummary sessionId={session.id} startedAt={session.started_at} onFinish={handleFinish} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <button
            onClick={handlePrevious}
            className="flex cursor-pointer items-center gap-0.5 self-start text-sm font-semibold text-neutral-400 transition-colors hover:text-neutral-600"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="text-lg font-extrabold text-neutral-900">{day.title}</span>
          <span className="text-sm font-medium text-neutral-500">
            Ejercicio {stepIndex + 1} de {steps.length}
          </span>
        </div>
        <button
          onClick={handleExit}
          aria-label="Salir del entrenamiento"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        >
          <X size={20} />
        </button>
      </div>

      {isSuperset && <Pill variant="accent" className="self-start">Superserie</Pill>}

      {isSuperset ? (
        <SupersetStep
          key={stepIndex}
          exercises={step}
          sessionId={session.id}
          sessionLogs={sessionLogs}
          onSetLogged={(restSec) => start(restSec ?? 60)}
        />
      ) : (
        <ExerciseStep
          key={stepIndex}
          exercise={step[0]}
          sessionId={session.id}
          sessionLogs={sessionLogs?.[step[0].id]}
          onSetLogged={(restSec) => start(restSec ?? 60)}
        />
      )}

      <Button onClick={handleNext} className="w-full">
        {isLast ? 'Terminar' : 'Siguiente ejercicio →'}
      </Button>

      {secondsLeft !== null && <RestTimer secondsLeft={secondsLeft} onSkip={skip} />}
    </div>
  );
}
