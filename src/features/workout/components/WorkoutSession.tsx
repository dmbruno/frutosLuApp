import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, Spinner } from '../../../components/ui';
import { ExerciseStep } from './ExerciseStep';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
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
  const { day, loading, sessionId, finish } = useWorkoutSession(programDayId);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();

  if (loading || !day) return <Spinner />;
  if (day.exercises.length === 0) {
    return <EmptyState title="Día sin ejercicios cargados" />;
  }

  const steps = groupSteps(day.exercises);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  async function handleNext() {
    if (isLast) {
      await finish(3, null);
      navigate('/');
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <button
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => i - 1)}
          className="text-sm text-neutral-400 disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-sm text-neutral-400">
          {stepIndex + 1} / {steps.length}
        </span>
        <button onClick={handleNext} className="text-sm font-medium text-brand-pink">
          {isLast ? 'Terminar' : 'Siguiente →'}
        </button>
      </div>

      {step.map((exercise) => (
        <ExerciseStep key={exercise.id} exercise={exercise} sessionId={sessionId!} onSetLogged={() => {}} />
      ))}
    </div>
  );
}
