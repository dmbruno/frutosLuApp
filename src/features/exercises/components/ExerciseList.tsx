import { EmptyState, Spinner } from '../../../components/ui';
import { ExerciseRow } from './ExerciseRow';
import type { Exercise } from '../../../types/domain';

interface ExerciseListProps {
  exercises: Exercise[] | undefined;
  loading: boolean;
  error: boolean;
  onEdit: (exercise: Exercise) => void;
  onArchive: (id: string) => void;
}

export function ExerciseList({ exercises, loading, error, onEdit, onArchive }: ExerciseListProps) {
  if (loading) return <Spinner />;
  if (error) return <EmptyState title="No pudimos cargar los ejercicios" />;
  if (!exercises || exercises.length === 0) {
    return <EmptyState title="Sin ejercicios" description="Creá el primero con el botón de arriba." />;
  }

  return (
    <div>
      {exercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          onEdit={() => onEdit(exercise)}
          onArchive={() => onArchive(exercise.id)}
        />
      ))}
    </div>
  );
}
