import { useMemo, useState, type ChangeEvent } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, ConfirmDialog, EmptyState, Input, Modal, Spinner } from '../../components/ui';
import { useReplacementLibrary } from '../../features/programs/hooks/useReplacementLibrary';
import { DAY_FORMAT_LABELS } from '../../features/programs/constants';
import { useToast } from '../../lib/ToastProvider';
import { useAdminHeaderAction } from '../../lib/AdminHeaderContext';
import type { DayWithExercises } from '../../types/domain';

export function ReplacementsPage() {
  const { data: days, isLoading, create, remove, uploadCoverImage } = useReplacementLibrary();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DayWithExercises | null>(null);
  const { showToast } = useToast();

  function resetForm() {
    setShowForm(false);
    setTitle('');
    setCoverImageUrl(null);
  }

  async function handleCoverFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCoverImageUrl(await uploadCoverImage.mutateAsync(file));
  }

  function handleCreate() {
    create.mutate(
      { title, coverImageUrl },
      {
        onSuccess: () => {
          resetForm();
          showToast('Rutina de reemplazo creada');
        },
      },
    );
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await remove.mutateAsync(pendingDelete.id);
    showToast(`"${pendingDelete.title}" eliminada`);
    setPendingDelete(null);
  }

  useAdminHeaderAction(
    useMemo(
      () => (
        <button
          onClick={() => setShowForm(true)}
          aria-label="Nueva rutina de reemplazo"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      ),
      [],
    ),
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden items-center justify-between md:flex">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Reemplazos</h1>
        <Button onClick={() => setShowForm(true)}>+ Nueva</Button>
      </div>
      <p className="text-sm text-neutral-500">
        Rutinas sueltas que cualquier alumno puede elegir en vez de su entrenamiento del día. No están atadas a
        ninguna semana ni hace falta asignarlas — quedan disponibles para todos.
      </p>

      {!days || days.length === 0 ? (
        <EmptyState title="Sin reemplazos" description="Creá el primero con el botón de arriba." />
      ) : (
        <div className="flex flex-col gap-2">
          {days.map((day) => (
            <Card key={day.id} className="flex items-center gap-3">
              <Link to={`/admin/reemplazos/${day.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                {day.cover_image_url ? (
                  <img
                    src={day.cover_image_url}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-2xl text-neutral-400">
                    🏋️
                  </div>
                )}
                <div className="min-w-0 flex-1 transition-opacity hover:opacity-70">
                  <p className="truncate font-medium">{day.title}</p>
                  <p className="text-sm text-neutral-500">
                    {DAY_FORMAT_LABELS[day.format ?? 'tradicional']}
                    {day.duration_min ? ` · ${day.duration_min}'` : ''} · {day.exercises.length} ejercicios
                  </p>
                </div>
              </Link>
              <button
                onClick={() => setPendingDelete(day)}
                className="shrink-0 cursor-pointer text-xs text-red-500 transition-opacity hover:opacity-70"
              >
                Eliminar
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={resetForm}>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Nombre de la rutina (ej: HIIT 30' tren superior)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex items-center gap-2">
            {coverImageUrl && (
              <img src={coverImageUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
            )}
            <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-neutral-300 px-3 py-3 text-center text-sm text-neutral-500 transition-colors hover:border-brand-pink/50 hover:bg-neutral-50">
              {uploadCoverImage.isPending ? 'Subiendo…' : coverImageUrl ? 'Cambiar portada' : 'Subir portada'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadCoverImage.isPending}
                onChange={handleCoverFile}
              />
            </label>
          </div>

          <Button onClick={handleCreate} disabled={create.isPending || !title.trim()}>
            {create.isPending ? 'Creando…' : 'Crear'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="¿Eliminar esta rutina?"
        description={pendingDelete ? `"${pendingDelete.title}" se va a borrar para todos los alumnos.` : undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
