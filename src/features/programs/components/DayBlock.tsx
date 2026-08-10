import { EXERCISE_BLOCKS } from '../../exercises/constants';
import { ProgramExerciseRow, type ProgramExerciseEdit } from './ProgramExerciseRow';
import type { DayWithExercises } from '../../../types/domain';
import type { ExerciseBlock } from '../../../types/database';

interface DayBlockProps {
  day: DayWithExercises;
  onAddExercise: (block: ExerciseBlock) => void;
  onEditExercise: (programExerciseId: string, input: ProgramExerciseEdit) => Promise<void>;
  onRemoveExercise: (programExerciseId: string, exerciseName: string) => void;
  onRemoveDay: () => void;
}

export function DayBlock({ day, onAddExercise, onEditExercise, onRemoveExercise, onRemoveDay }: DayBlockProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xl font-extrabold text-neutral-900">{day.title}</p>
        <button
          onClick={onRemoveDay}
          className="cursor-pointer text-xs text-neutral-400 transition-colors hover:text-red-400"
        >
          eliminar día
        </button>
      </div>
      {EXERCISE_BLOCKS.map((block) => {
        const exercisesInBlock = day.exercises.filter((e) => e.block === block);
        if (exercisesInBlock.length === 0 && block === 'otro') return null;
        return (
          <div key={block} className="mb-6 last:mb-0">
            <div className="mb-2 flex items-center justify-between border-b-2 border-neutral-200 pb-1.5">
              <p className="font-display text-base font-bold uppercase tracking-wide text-neutral-900">{block}</p>
              <button
                onClick={() => onAddExercise(block)}
                className="cursor-pointer text-xs font-medium text-brand-pink transition-opacity hover:opacity-70"
              >
                + agregar
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {exercisesInBlock.map((pe, index) => (
                <ProgramExerciseRow
                  key={pe.id}
                  programExercise={pe}
                  fallbackOrderCode={String(index + 1)}
                  onEdit={(input) => onEditExercise(pe.id, input)}
                  onRemove={() => onRemoveExercise(pe.id, pe.exercise.name)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
