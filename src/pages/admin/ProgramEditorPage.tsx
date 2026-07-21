import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui';
import { ProgramEditor } from '../../features/programs/components/ProgramEditor';
import { AssignModal } from '../../features/programs/components/AssignModal';

export function ProgramEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [showAssign, setShowAssign] = useState(false);
  if (!id) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowAssign(true)}>Asignar a alumno</Button>
      </div>
      <ProgramEditor programId={id} />
      <AssignModal open={showAssign} onClose={() => setShowAssign(false)} templateId={id} />
    </div>
  );
}
