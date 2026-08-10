import { useState } from 'react';
import { Collapse, VideoEmbed } from '../../../components/ui';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseRowProps {
  exercise: ProgramExerciseWithExercise;
  repsLabel: string;
}

export function ExerciseRow({ exercise, repsLabel }: ExerciseRowProps) {
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = exercise.exercise.video_url;

  return (
    <div className="border-b border-neutral-100 py-3 last:border-0">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {exercise.order_code && (
              <span className="mt-0.5 w-6 shrink-0 text-sm font-extrabold tabular-nums text-neutral-900">
                {exercise.order_code}
              </span>
            )}
            <span className="text-sm font-semibold text-neutral-900">{exercise.exercise.name}</span>
          </div>
          {exercise.coach_note && (
            <p className="mt-1 text-xs font-semibold text-brand-pink">{exercise.coach_note}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => videoUrl && setShowVideo((v) => !v)}
            disabled={!videoUrl}
            aria-label={videoUrl ? (showVideo ? 'Ocultar video' : 'Ver video del ejercicio') : undefined}
            className={`relative ${videoUrl ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <ExerciseThumbnail exercise={exercise.exercise} />
            {videoUrl && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-[10px] text-white shadow">
                ▶
              </span>
            )}
          </button>
          <span className="text-xs font-medium text-neutral-500">{repsLabel}</span>
        </div>
      </div>

      <div className="-mx-4">
        <Collapse open={showVideo}>
          {videoUrl && (
            <div className="pt-5">
              <VideoEmbed url={videoUrl} title={exercise.exercise.name} rounded={false} />
            </div>
          )}
        </Collapse>
      </div>
    </div>
  );
}
