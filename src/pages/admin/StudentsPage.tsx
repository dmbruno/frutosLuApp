import { useState } from 'react';
import { Button } from '../../components/ui';
import { StudentList } from '../../features/students/components/StudentList';
import { InviteStudentModal } from '../../features/students/components/InviteStudentModal';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl font-semibold">Alumnos</h1>
        <Button onClick={() => setShowInvite(true)}>+ Agregar alumna</Button>
      </div>
      <StudentList students={students} loading={isLoading} />
      <InviteStudentModal open={showInvite} onClose={() => setShowInvite(false)} />
    </div>
  );
}
