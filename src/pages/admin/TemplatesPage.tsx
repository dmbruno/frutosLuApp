import { useState } from 'react';
import { Button, Input, Modal } from '../../components/ui';
import { TemplateLibrary } from '../../features/programs/components/TemplateLibrary';
import { useTemplates } from '../../features/programs/hooks/useTemplates';

export function TemplatesPage() {
  const { data: templates, isLoading, create } = useTemplates();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  function handleCreate() {
    create.mutate(name, {
      onSuccess: () => {
        setShowForm(false);
        setName('');
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold">Plantillas</h1>
        <Button onClick={() => setShowForm(true)}>+ Nueva</Button>
      </div>

      <TemplateLibrary templates={templates} loading={isLoading} />

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
