import { useState } from 'react';
import { Button } from '../../components/ui';
import { StudentList } from '../../features/students/components/StudentList';
import { InviteStudentModal } from '../../features/students/components/InviteStudentModal';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const [showInvite, setShowInvite] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const filtered = students?.filter((s) =>
    showInactive ? s.subscription_status === 'inactive' : s.subscription_status === 'active',
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold">Alumnos</h1>
        <Button onClick={() => setShowInvite(true)}>+ Agregar alumna</Button>
      </div>

      <button
        onClick={() => setShowInactive((v) => !v)}
        className="self-start text-sm font-medium text-neutral-500 underline"
      >
        {showInactive ? '← Volver a activas' : 'Ver desactivados'}
      </button>

      <StudentList students={filtered} loading={isLoading} mode={showInactive ? 'inactive' : 'active'} />

      <InviteStudentModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}
