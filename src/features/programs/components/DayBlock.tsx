import { EXERCISE_BLOCKS } from '../../exercises/constants';
import { ProgramExerciseRow } from './ProgramExerciseRow';
import type { DayWithExercises } from '../../../types/domain';
import type { ExerciseBlock } from '../../../types/database';

interface DayBlockProps {
  day: DayWithExercises;
  onAddExercise: (block: ExerciseBlock) => void;
  onEditExercise: (programExerciseId: string, setsRepsText: string) => void;
  onRemoveExercise: (programExerciseId: string) => void;
  onRemoveDay: () => void;
}

export function DayBlock({ day, onAddExercise, onEditExercise, onRemoveExercise, onRemoveDay }: DayBlockProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">{day.title}</p>
        <button onClick={onRemoveDay} className="text-xs text-neutral-400">
          eliminar día
        </button>
      </div>
      {EXERCISE_BLOCKS.map((block) => {
        const exercisesInBlock = day.exercises.filter((e) => e.block === block);
        if (exercisesInBlock.length === 0 && block === 'otro') return null;
        return (
          <div key={block} className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-neutral-400">{block}</p>
              <button onClick={() => onAddExercise(block)} className="text-xs text-brand-pink">
                + agregar
              </button>
            </div>
            {exercisesInBlock.map((pe) => (
              <ProgramExerciseRow
                key={pe.id}
                programExercise={pe}
                onChangeSetsReps={(text) => onEditExercise(pe.id, text)}
                onRemove={() => onRemoveExercise(pe.id)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
