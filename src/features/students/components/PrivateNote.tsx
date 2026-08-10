import { useStudentNote } from '../hooks/useStudentNote';
import { usePendingChanges } from '../../../lib/PendingChangesContext';

interface PrivateNoteProps {
  userId: string;
}

export function PrivateNote({ userId }: PrivateNoteProps) {
  const { note, loading, save } = useStudentNote(userId);
  const pending = usePendingChanges();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Nota privada (solo vos la ves)</p>
      {loading ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : (
        <textarea
          key={note}
          defaultValue={note}
          onBlur={(e) => {
            const value = e.target.value;
            if (value === note) {
              pending?.clearPending('private-note');
              return;
            }
            if (pending) {
              pending.registerPending('private-note', () => save.mutateAsync(value));
            } else {
              save.mutate(value);
            }
          }}
          placeholder="Anotaciones que no ve el alumno…"
          className="w-full rounded-2xl border border-neutral-300 p-3 text-sm focus:border-neutral-900 focus:outline-none"
          rows={3}
        />
      )}
      {!pending && save.isPending && <p className="mt-1 text-xs text-neutral-400">Guardando…</p>}
    </div>
  );
}
