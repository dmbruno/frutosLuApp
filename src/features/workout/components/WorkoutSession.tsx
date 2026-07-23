import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, Spinner } from '../../../components/ui';
import { ExerciseStep } from './ExerciseStep';
import { RestTimer } from './RestTimer';
import { SessionSummary } from './SessionSummary';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { useRestTimer } from '../hooks/useRestTimer';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface WorkoutSessionProps {
  programDayId: string;
}

function groupSteps(exercises: ProgramExerciseWithExercise[]): ProgramExerciseWithExercise[][] {
  const steps: ProgramExerciseWithExercise[][] = [];
  const seenGroups = new Set<string>();
  for (const exercise of exercises) {
    if (exercise.superset_group) {
      if (seenGroups.has(exercise.superset_group)) continue;
      seenGroups.add(exercise.superset_group);
      steps.push(exercises.filter((e) => e.superset_group === exercise.superset_group));
    } else {
      steps.push([exercise]);
    }
  }
  return steps;
}

export function WorkoutSession({ programDayId }: WorkoutSessionProps) {
  const { day, loading, session, finish } = useWorkoutSession(programDayId);
  const { secondsLeft, start, skip } = useRestTimer();
  const [stepIndex, setStepIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  if (loading || !day || !session) return <Spinner />;
  if (day.exercises.length === 0) {
    return <EmptyState title="Día sin ejercicios cargados" />;
  }

  const steps = groupSteps(day.exercises);
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

  async function handleFinish(feeling: number, note: string | null) {
    await finish(feeling, note);
    navigate('/');
  }

  if (showSummary) {
    return <SessionSummary sessionId={session.id} startedAt={session.started_at} onFinish={handleFinish} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-500">
          {day.title} · ejercicio {stepIndex + 1} de {steps.length}
        </span>
        <button
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => i - 1)}
          className="self-start text-sm text-neutral-400 disabled:opacity-30"
        >
          ← Anterior
        </button>
      </div>

      {isSuperset && (
        <p className="self-start rounded-full bg-brand-pink/10 px-3 py-1 text-xs font-semibold text-brand-pink">
          Superserie
        </p>
      )}

      {step.map((exercise) => (
        <ExerciseStep
          key={exercise.id}
          exercise={exercise}
          sessionId={session.id}
          onSetLogged={(restSec) => start(restSec ?? 60)}
        />
      ))}

      <Button onClick={handleNext} className="w-full">
        {isLast ? 'Terminar' : 'Siguiente ejercicio →'}
      </Button>

      {secondsLeft !== null && <RestTimer secondsLeft={secondsLeft} onSkip={skip} />}
    </div>
  );
}
