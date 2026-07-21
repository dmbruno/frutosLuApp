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
}

export function ExerciseList({ exercises, loading, error, onEdit, onArchive }: ExerciseListProps) {
  const [pendingArchive, setPendingArchive] = useState<Exercise | null>(null);
  const { showToast } = useToast();

  if (loading) return <Spinner />;
  if (error) return <EmptyState title="No pudimos cargar los ejercicios" />;
  if (!exercises || exercises.length === 0) {
    return <EmptyState title="Sin ejercicios" description="Creá el primero con el botón de arriba." />;
  }

  async function handleConfirmArchive() {
    if (!pendingArchive) return;
    await onArchive(pendingArchive.id);
    showToast(`"${pendingArchive.name}" archivado`);
    setPendingArchive(null);
  }

  return (
    <div>
      {exercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          onEdit={() => onEdit(exercise)}
          onArchive={() => setPendingArchive(exercise)}
        />
      ))}

      <ConfirmDialog
        open={!!pendingArchive}
        title="¿Archivar este ejercicio?"
        description={
          pendingArchive
            ? `"${pendingArchive.name}" deja de aparecer en el catálogo, pero el historial de las alumnas no se pierde.`
            : undefined
        }
        confirmLabel="Archivar"
        onConfirm={handleConfirmArchive}
        onCancel={() => setPendingArchive(null)}
      />
    </div>
  );
}
