import { useLastPerformance } from '../hooks/useLastPerformance';
import { SetRow } from './SetRow';
import { VideoEmbed } from '../../../components/ui';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseStepProps {
  exercise: ProgramExerciseWithExercise;
  sessionId: string;
  onSetLogged: (restSec: number | null) => void;
}

export function ExerciseStep({ exercise, sessionId, onSetLogged }: ExerciseStepProps) {
  const numSets = exercise.parsed_sets ?? 3;
  const { data: lastPerformances } = useLastPerformance(exercise.id);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-neutral-400">{exercise.order_code}</p>
      <h3 className="font-display text-lg font-semibold">{exercise.exercise.name}</h3>
      <p className="text-sm text-neutral-500">{exercise.sets_reps_text}</p>
      {exercise.exercise.instructions && (
        <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{exercise.exercise.instructions}</p>
      )}
      {exercise.coach_note && (
        <p className="mt-1 rounded-lg bg-brand-amber/10 p-2 text-sm text-brand-amber">{exercise.coach_note}</p>
      )}
      {exercise.exercise.video_url && (
        <VideoEmbed url={exercise.exercise.video_url} title={exercise.exercise.name} />
      )}
      <div className="mt-3">
        <div className="grid grid-cols-[28px_1fr_132px_56px_48px] gap-2 px-1 pb-1 text-xs font-semibold uppercase text-neutral-400">
          <span>#</span>
          <span>Última vez</span>
          <span className="text-center">Kg</span>
          <span className="text-center">Reps</span>
          <span />
        </div>
        <div className="flex flex-col divide-y divide-neutral-100">
          {Array.from({ length: numSets }, (_, i) => i + 1).map((setNumber) => (
            <SetRow
              key={setNumber}
              sessionId={sessionId}
              programExerciseId={exercise.id}
              exerciseId={exercise.exercise_id}
              setNumber={setNumber}
              lastWeightKg={lastPerformances?.[setNumber]?.weight_kg ?? null}
              lastReps={lastPerformances?.[setNumber]?.reps ?? null}
              onLogged={() => onSetLogged(exercise.rest_sec)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
