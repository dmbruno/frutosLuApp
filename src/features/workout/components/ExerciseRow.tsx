import { toSentenceCase } from '../../../lib/utils/format';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseRowProps {
  exercise: ProgramExerciseWithExercise;
  repsLabel: string;
}

export function ExerciseRow({ exercise, repsLabel }: ExerciseRowProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-9 shrink-0 text-xs text-neutral-500">{repsLabel}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-neutral-900">{toSentenceCase(exercise.exercise.name)}</p>
        {exercise.coach_note && <p className="mt-0.5 text-xs font-semibold text-brand-pink">{exercise.coach_note}</p>}
      </div>
    </div>
  );
}
