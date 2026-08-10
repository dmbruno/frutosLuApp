import { useState } from 'react';
import { Button, Input } from '../../components/ui';
import { StudentList } from '../../features/students/components/StudentList';
import { CreateUserModal } from '../../features/students/components/CreateUserModal';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const [showCreate, setShowCreate] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = students
    ?.filter((s) => (showInactive ? s.subscription_status === 'inactive' : s.subscription_status === 'active'))
    .filter((s) => s.full_name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-neutral-900">Alumnos</h1>
        <Button onClick={() => setShowCreate(true)}>+ Agregar usuario</Button>
      </div>

      <Input placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="flex gap-2">
        <button
          onClick={() => setShowInactive(false)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !showInactive ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setShowInactive(true)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            showInactive ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Desactivados
        </button>
      </div>

      <StudentList students={filtered} loading={isLoading} mode={showInactive ? 'inactive' : 'active'} />

      <CreateUserModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
