import { VideoEmbed } from '../../../components/ui';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseHeaderProps {
  exercise: ProgramExerciseWithExercise;
}

export function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
  return (
    <>
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
    </>
  );
}
