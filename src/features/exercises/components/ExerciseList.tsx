import { useState } from 'react';
import { ConfirmDialog, EmptyState, Spinner } from '../../../components/ui';
import { ExerciseRow } from './ExerciseRow';
import { useToast } from '../../../lib/ToastProvider';
import type { Exercise } from '../../../types/domain';

interface ExerciseListProps {
  exercises: Exercise[] | undefined;
  loading: boolean;
  error: boolean;
  onEdit: (exercise: Exercise) => void;
  onArchive: (id: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

type PendingAction = { type: 'archive' | 'delete'; exercise: Exercise };

export function ExerciseList({ exercises, loading, error, onEdit, onArchive, onDelete }: ExerciseListProps) {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const { showToast } = useToast();

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="No pudimos cargar los ejercicios" />;
  if (!exercises || exercises.length === 0) {
    return <EmptyState title="Sin ejercicios" description="Creá el primero con el botón de arriba." />;
  }

  async function handleConfirm() {
    if (!pending) return;
    try {
      if (pending.type === 'archive') {
        await onArchive(pending.exercise.id);
        showToast(`"${pending.exercise.name}" archivado`);
      } else {
        await onDelete(pending.exercise.id);
        showToast(`"${pending.exercise.name}" eliminado`);
      }
      setPending(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No pudimos completar la acción');
      setPending(null);
    }
  }

  return (
    <div>
      {exercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          onEdit={() => onEdit(exercise)}
          onArchive={() => setPending({ type: 'archive', exercise })}
          onDelete={() => setPending({ type: 'delete', exercise })}
        />
      ))}

      <ConfirmDialog
        open={!!pending}
        title={pending?.type === 'archive' ? '¿Archivar este ejercicio?' : '¿Eliminar este ejercicio para siempre?'}
        description={
          pending
            ? pending.type === 'archive'
              ? `"${pending.exercise.name}" deja de aparecer en el catálogo, pero el historial de las alumnas no se pierde.`
              : `"${pending.exercise.name}" se borra por completo. Si ya tiene series o rutinas asociadas, no se va a poder — usá "Archivar" en ese caso.`
            : undefined
        }
        confirmLabel={pending?.type === 'archive' ? 'Archivar' : 'Eliminar'}
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
