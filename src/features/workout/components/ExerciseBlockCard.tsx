import { Repeat } from 'lucide-react';
import { getDisplaySets, stripSetsPrefix } from '../../../lib/utils/blockSummary';
import { ExerciseRow } from './ExerciseRow';
import { BlockVideoList } from './BlockVideoList';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseBlockCardProps {
  title: string;
  subtitle?: string;
  exercises: ProgramExerciseWithExercise[];
}

export function ExerciseBlockCard({ title, subtitle, exercises }: ExerciseBlockCardProps) {
  const displaySets = getDisplaySets(exercises);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <p className="text-base font-semibold text-neutral-900">{title}</p>
          {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
        </div>
        {displaySets && (
          <span className="flex shrink-0 items-center gap-1 text-base font-semibold text-neutral-900">
            <Repeat size={16} strokeWidth={2.25} />
            {displaySets} series
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b border-neutral-100 px-4 py-4">
        {exercises.map((ex) => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            repsLabel={ex.parsed_sets ? stripSetsPrefix(ex.sets_reps_text, ex.parsed_sets) : ex.sets_reps_text}
          />
        ))}
      </div>

      <div className="px-4">
        <BlockVideoList exercises={exercises} />
      </div>
    </div>
  );
}
