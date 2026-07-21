import { useStudentNote } from '../hooks/useStudentNote';

interface PrivateNoteProps {
  userId: string;
}

export function PrivateNote({ userId }: PrivateNoteProps) {
  const { note, loading, save } = useStudentNote(userId);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Nota privada (solo vos la ves)</p>
      {loading ? (
        <p className="text-sm text-neutral-400">Cargando…</p>
      ) : (
        <textarea
          key={note}
          defaultValue={note}
          onBlur={(e) => {
            if (e.target.value !== note) save.mutate(e.target.value);
          }}
          placeholder="Anotaciones que no ve la alumna…"
          className="w-full rounded-xl border border-neutral-300 p-3 text-sm"
          rows={3}
        />
      )}
      {save.isPending && <p className="mt-1 text-xs text-neutral-400">Guardando…</p>}
    </div>
  );
}
