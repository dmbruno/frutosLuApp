import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Input, Modal } from '../../components/ui';
import { TemplateLibrary } from '../../features/programs/components/TemplateLibrary';
import { useTemplates } from '../../features/programs/hooks/useTemplates';
import { useToast } from '../../lib/ToastProvider';
import { useAdminHeaderAction } from '../../lib/AdminHeaderContext';

export function TemplatesPage() {
  const { data: templates, isLoading, create, remove } = useTemplates();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const { showToast } = useToast();

  function handleCreate() {
    create.mutate(name, {
      onSuccess: () => {
        setShowForm(false);
        setName('');
        showToast('Plantilla creada');
      },
    });
  }

  useAdminHeaderAction(
    useMemo(
      () => (
        <button
          onClick={() => setShowForm(true)}
          aria-label="Nueva plantilla"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-neutral-900 transition hover:bg-neutral-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      ),
      [],
    ),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden items-center justify-between md:flex">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Plantillas</h1>
        <Button onClick={() => setShowForm(true)}>+ Nueva</Button>
      </div>

      <TemplateLibrary templates={templates} loading={isLoading} onDelete={(id) => remove.mutateAsync(id)} />

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <div className="flex flex-col gap-3">
          <Input placeholder="Nombre de la plantilla" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={handleCreate} disabled={create.isPending}>
            {create.isPending ? 'Creando…' : 'Crear'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
