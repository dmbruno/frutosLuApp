import { useState } from 'react';
import { Play } from 'lucide-react';
import { Collapse, VideoEmbed } from '../../../components/ui';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseHeaderProps {
  exercise: ProgramExerciseWithExercise;
}

export function ExerciseHeader({ exercise }: ExerciseHeaderProps) {
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = exercise.exercise.video_url;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-xl font-extrabold text-neutral-900">{exercise.exercise.name}</h3>
        <button
          type="button"
          onClick={() => setShowVideo((v) => !v)}
          disabled={!videoUrl}
          aria-label={videoUrl ? 'Ver video explicativo' : 'Sin video disponible'}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
            videoUrl
              ? `cursor-pointer border-neutral-300 hover:border-brand-pink hover:text-brand-pink ${
                  showVideo ? 'border-brand-pink text-brand-pink' : 'text-neutral-700'
                }`
              : 'cursor-not-allowed border-neutral-200 text-neutral-300'
          }`}
        >
          <Play size={14} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
      <p className="text-sm text-neutral-500">{exercise.sets_reps_text}</p>
      {exercise.exercise.instructions && (
        <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{exercise.exercise.instructions}</p>
      )}
      {exercise.coach_note && (
        <p className="mt-1 text-sm font-semibold text-brand-pink">{exercise.coach_note}</p>
      )}
      {videoUrl && (
        <Collapse open={showVideo} duration={0.45}>
          <VideoEmbed url={videoUrl} title={exercise.exercise.name} />
        </Collapse>
      )}
    </>
  );
}
