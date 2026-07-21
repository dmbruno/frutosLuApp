import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Input, Modal } from '../../components/ui';
import { TemplateLibrary } from '../../features/programs/components/TemplateLibrary';
import { useTemplates } from '../../features/programs/hooks/useTemplates';
import { createTemplate } from '../../features/programs/api';

export function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  async function handleCreate() {
    await createTemplate(name);
    queryClient.invalidateQueries({ queryKey: ['templates'] });
    setShowForm(false);
    setName('');
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
          <Button onClick={handleCreate}>Crear</Button>
        </div>
      </Modal>
    </div>
  );
}
