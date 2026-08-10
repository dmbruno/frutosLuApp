import { Pencil, Archive, Trash2, RotateCw } from 'lucide-react';
import { Pill } from '../../../components/ui';
import type { Exercise } from '../../../types/domain';

interface ExerciseRowProps {
  exercise: Exercise;
  onEdit: () => void;
  onArchive: () => void;
  onReactivate: () => void;
  onDelete: () => void;
}

const ICON_BUTTON =
  'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors';

export function ExerciseRow({ exercise, onEdit, onArchive, onReactivate, onDelete }: ExerciseRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-neutral-100 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-neutral-900">{exercise.name}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          <Pill>{exercise.primary_muscle}</Pill>
          {exercise.default_block && <Pill>{exercise.default_block}</Pill>}
          {exercise.needs_filming && <Pill className="bg-red-100 text-red-600">*FILMAR</Pill>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        {exercise.is_archived ? (
          <button
            onClick={onReactivate}
            aria-label="Reactivar"
            className={`${ICON_BUTTON} text-brand-pink hover:bg-brand-pink/10`}
          >
            <RotateCw size={15} />
          </button>
        ) : (
          <>
            <button
              onClick={onEdit}
              aria-label="Editar"
              className={`${ICON_BUTTON} text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900`}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={onArchive}
              aria-label="Archivar"
              className={`${ICON_BUTTON} text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700`}
            >
              <Archive size={15} />
            </button>
          </>
        )}
        <button
          onClick={onDelete}
          aria-label="Eliminar"
          className={`${ICON_BUTTON} text-neutral-400 hover:bg-red-50 hover:text-red-500`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
