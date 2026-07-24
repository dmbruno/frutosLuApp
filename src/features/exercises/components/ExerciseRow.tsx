import { Pill } from '../../../components/ui';
import type { Exercise } from '../../../types/domain';

interface ExerciseRowProps {
  exercise: Exercise;
  onEdit: () => void;
  onArchive: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

export function ExerciseRow({ exercise, onEdit, onArchive, onReactivate, onDelete }: ExerciseRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-neutral-100 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{exercise.name}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Pill>{exercise.primary_muscle}</Pill>
          {exercise.default_block && <Pill>{exercise.default_block}</Pill>}
          {exercise.needs_filming && <Pill className="bg-red-100 text-red-600">*FILMAR</Pill>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-sm md:flex-row md:items-center md:gap-3">
        {exercise.is_archived ? (
          <button onClick={onReactivate} className="cursor-pointer text-brand-pink transition-opacity hover:opacity-70">
            Reactivar
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={onEdit} className="cursor-pointer text-brand-pink transition-opacity hover:opacity-70">
              Editar
            </button>
            <button onClick={onArchive} className="cursor-pointer text-neutral-400 transition-opacity hover:opacity-70">
              Archivar
            </button>
          </div>
        )}
        <button
          onClick={onDelete}
          className="cursor-pointer text-xs text-red-400 transition-opacity hover:opacity-70 md:text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
