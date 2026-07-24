import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, ConfirmDialog, EmptyState, Spinner } from '../../../components/ui';
import { useToast } from '../../../lib/ToastProvider';
import type { Program } from '../../../types/domain';

interface TemplateLibraryProps {
  templates: Program[] | undefined;
  loading: boolean;
  onDelete: (id: string) => Promise<unknown>;
}

export function TemplateLibrary({ templates, loading, onDelete }: TemplateLibraryProps) {
  const [pendingDelete, setPendingDelete] = useState<Program | null>(null);
  const { showToast } = useToast();

  if (loading) return <Spinner />;
  if (!templates || templates.length === 0) {
    return <EmptyState title="Sin plantillas" description="Creá la primera con el botón de arriba." />;
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await onDelete(pendingDelete.id);
    showToast(`"${pendingDelete.name}" eliminada`);
    setPendingDelete(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {templates.map((template) => (
        <Card key={template.id} className="flex items-center gap-3">
          <Link
            to={`/admin/plantillas/${template.id}`}
            className="min-w-0 flex-1 transition-opacity hover:opacity-70"
          >
            <p className="truncate font-medium">{template.name}</p>
            <p className="text-sm text-neutral-500">
              {template.total_weeks ?? '—'} semanas · {new Set(template.cycle_pattern ?? []).size || '—'} tipos de
              semana
            </p>
          </Link>
          <button
            onClick={() => setPendingDelete(template)}
            className="shrink-0 cursor-pointer text-xs text-red-500 transition-opacity hover:opacity-70"
          >
            Eliminar
          </button>
        </Card>
      ))}

      <ConfirmDialog
        open={!!pendingDelete}
        title="¿Eliminar esta plantilla?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" se va a borrar. Los alumnos que ya la tienen asignada no se ven afectados.`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
