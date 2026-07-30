import { useState } from 'react';
import { Collapse, VideoEmbed } from '../../../components/ui';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface BlockVideoListProps {
  exercises: ProgramExerciseWithExercise[];
}

export function BlockVideoList({ exercises }: BlockVideoListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-neutral-600 shadow-sm transition-colors hover:text-brand-pink"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink/10 text-[10px] text-brand-pink">
          ▶
        </span>
        {open ? 'Ocultar videos' : 'Ver videos'}
      </button>

      <div className="-mx-4">
        <Collapse open={open}>
          <div className="flex flex-col gap-6 pt-3">
            {exercises.map((ex) => (
              <div key={ex.id}>
                <div className="mb-2 flex items-center gap-3 px-4">
                  <ExerciseThumbnail exercise={ex.exercise} size="sm" />
                  <span className="text-sm font-medium text-neutral-700">{ex.exercise.name}</span>
                </div>
                {ex.exercise.video_url ? (
                  <div className="pt-5">
                    <VideoEmbed url={ex.exercise.video_url} title={ex.exercise.name} rounded={false} />
                  </div>
                ) : (
                  <p className="px-4 text-xs text-neutral-400">Todavía sin video.</p>
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
}
