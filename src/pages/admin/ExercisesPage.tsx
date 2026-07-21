import { useState } from 'react';
import { Button, Input, Modal } from '../../components/ui';
import { ExerciseList } from '../../features/exercises/components/ExerciseList';
import { ExerciseForm } from '../../features/exercises/components/ExerciseForm';
import { useExercises } from '../../features/exercises/hooks/useExercises';
import { useExerciseMutations } from '../../features/exercises/hooks/useExerciseMutations';
import { useToast } from '../../lib/ToastProvider';
import { EXERCISE_BLOCKS } from '../../features/exercises/constants';
import type { Exercise } from '../../types/domain';
import type { Database, ExerciseBlock } from '../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

const BLOCK_LABELS: Record<ExerciseBlock, string> = {
  movilidad: 'Movilidad',
  core: 'Core',
  estructura: 'Estructura',
  cardio: 'Cardio',
  otro: 'Otro',
};

export function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [blockFilter, setBlockFilter] = useState<ExerciseBlock | null>(null);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: exercises, isLoading, isError } = useExercises(search, blockFilter ?? undefined);
  const { create, update, archive } = useExerciseMutations();
  const { showToast } = useToast();

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(exercise: Exercise) {
    setEditing(exercise);
    setShowForm(true);
  }

  function handleSubmit(input: ExerciseInsert) {
    if (editing) {
      update.mutate(
        { id: editing.id, input },
        {
          onSuccess: () => {
            setShowForm(false);
            showToast('Ejercicio actualizado');
          },
        },
      );
    } else {
      create.mutate(input, {
        onSuccess: () => {
          setShowForm(false);
          showToast('Ejercicio creado');
        },
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold">Catálogo de ejercicios</h1>
        <Button onClick={openCreate}>+ Nuevo</Button>
      </div>

      <Input placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBlockFilter(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            blockFilter === null ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Todos
        </button>
        {EXERCISE_BLOCKS.map((block) => (
          <button
            key={block}
            onClick={() => setBlockFilter(block)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              blockFilter === block ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {BLOCK_LABELS[block]}
          </button>
        ))}
      </div>

      <ExerciseList
        exercises={exercises}
        loading={isLoading}
        error={isError}
        onEdit={openEdit}
        onArchive={(id) => archive.mutateAsync(id)}
      />

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ExerciseForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
