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
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: exercises, isLoading, isError } = useExercises(search, blockFilter ?? undefined, showArchived);
  const { create, update, archive, reactivate, remove, uploadThumbnail } = useExerciseMutations();
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
      <div className="sticky -top-6 -mx-6 -mt-6 z-10 flex transform-gpu flex-col gap-4 bg-neutral-50 px-6 pt-6 pb-4 [will-change:transform]">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-xl font-semibold">Catálogo de ejercicios</h1>
          <Button onClick={openCreate}>+ Nuevo</Button>
        </div>

        <Input placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />

        <button
          onClick={() => setShowArchived((v) => !v)}
          className="cursor-pointer self-start text-sm font-medium text-neutral-500 underline transition-colors hover:text-neutral-700"
        >
          {showArchived ? '← Volver al catálogo activo' : 'Ver archivados'}
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setBlockFilter(null)}
            className={`cursor-pointer rounded-full px-2 py-1.5 text-sm font-medium transition-colors ${
              blockFilter === null ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Todos
          </button>
          {EXERCISE_BLOCKS.map((block) => (
            <button
              key={block}
              onClick={() => setBlockFilter(block)}
              className={`cursor-pointer rounded-full px-2 py-1.5 text-sm font-medium transition-colors ${
                blockFilter === block ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {BLOCK_LABELS[block]}
            </button>
          ))}
        </div>
      </div>

      <ExerciseList
        exercises={exercises}
        loading={isLoading}
        error={isError}
        emptyDescription={showArchived ? 'No archivaste ningún ejercicio todavía.' : undefined}
        onEdit={openEdit}
        onArchive={(id) => archive.mutateAsync(id)}
        onReactivate={(id) => reactivate.mutateAsync(id)}
        onDelete={(id) => remove.mutateAsync(id)}
      />

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ExerciseForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          submitting={create.isPending || update.isPending}
          onUploadThumbnail={(file) => uploadThumbnail.mutateAsync(file)}
        />
      </Modal>
    </div>
  );
}
