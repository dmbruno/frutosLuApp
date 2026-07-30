import { useLastPerformance } from '../hooks/useLastPerformance';
import { buildSetSlots } from '../buildSetSlots';
import { ExerciseHeader } from './ExerciseHeader';
import { SetRow } from './SetRow';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseStepProps {
  exercise: ProgramExerciseWithExercise;
  sessionId: string;
  onSetLogged: (restSec: number | null) => void;
}

export function ExerciseStep({ exercise, sessionId, onSetLogged }: ExerciseStepProps) {
  const { data: lastPerformances } = useLastPerformance(exercise.id);
  const slots = buildSetSlots(exercise);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ExerciseHeader exercise={exercise} />
      <div className="mt-3">
        <div className="flex flex-col">
          {slots.map((slot) => (
            <SetRow
              key={slot.setNumber}
              sessionId={sessionId}
              programExerciseId={exercise.id}
              exerciseId={exercise.exercise_id}
              setNumber={slot.setNumber}
              label={slot.label}
              unit={exercise.rep_unit}
              trackWeight={exercise.exercise.kind !== 'movilidad'}
              parsedReps={exercise.parsed_reps}
              lastWeightKg={lastPerformances?.[slot.setNumber]?.weight_kg ?? null}
              lastReps={lastPerformances?.[slot.setNumber]?.reps ?? null}
              onLogged={() => onSetLogged(exercise.rest_sec)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
