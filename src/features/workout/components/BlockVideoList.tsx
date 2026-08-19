import { useState } from 'react';
import { Play } from 'lucide-react';
import { Collapse, VideoEmbed } from '../../../components/ui';
import { toSentenceCase } from '../../../lib/utils/format';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface BlockVideoListProps {
  exercises: ProgramExerciseWithExercise[];
}

export function BlockVideoList({ exercises }: BlockVideoListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2.5 py-4 text-sm font-medium text-neutral-700 transition-colors hover:text-brand-pink"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-300 text-neutral-500">
          <Play size={13} fill="currentColor" strokeWidth={0} />
        </span>
        {open ? 'Ocultar ejercicios' : 'Ver ejercicios'}
      </button>

      <Collapse open={open} duration={0.45}>
        <div className="flex flex-col gap-6 pb-4 pt-1">
          {exercises.map((ex) => (
            <div key={ex.id}>
              <div className="mb-2 flex items-center gap-3">
                <ExerciseThumbnail exercise={ex.exercise} size="sm" />
                <span className="text-sm text-neutral-900">{toSentenceCase(ex.exercise.name)}</span>
              </div>
              {ex.exercise.video_url ? (
                <VideoEmbed url={ex.exercise.video_url} title={ex.exercise.name} />
              ) : (
                <p className="text-xs text-neutral-400">Todavía sin video.</p>
              )}
            </div>
          ))}
        </div>
      </Collapse>
    </div>
  );
}
