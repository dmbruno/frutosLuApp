import { useParams } from 'react-router-dom';
import { ProgramEditor } from '../../features/programs/components/ProgramEditor';

export function ProgramEditorPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <ProgramEditor programId={id} />;
}
