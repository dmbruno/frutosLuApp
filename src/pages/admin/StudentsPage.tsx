import { useState } from 'react';
import { Button } from '../../components/ui';
import { StudentList } from '../../features/students/components/StudentList';
import { CreateUserModal } from '../../features/students/components/CreateUserModal';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const [showCreate, setShowCreate] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  const filtered = students?.filter((s) =>
    showInactive ? s.subscription_status === 'inactive' : s.subscription_status === 'active',
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold">Alumnos</h1>
        <Button onClick={() => setShowCreate(true)}>+ Agregar usuario</Button>
      </div>

      <button
        onClick={() => setShowInactive((v) => !v)}
        className="cursor-pointer self-start text-sm font-medium text-neutral-500 underline transition-colors hover:text-neutral-700"
      >
        {showInactive ? '← Volver a activos' : 'Ver desactivados'}
      </button>

      <StudentList students={filtered} loading={isLoading} mode={showInactive ? 'inactive' : 'active'} />

      <CreateUserModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
