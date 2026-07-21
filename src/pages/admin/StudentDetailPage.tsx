import { useParams } from 'react-router-dom';
import { EmptyState, Spinner } from '../../components/ui';
import { useStudent } from '../../features/students/hooks/useStudent';
import { useStudentPrograms } from '../../features/programs/hooks/useStudentPrograms';
import { ProgramEditor } from '../../features/programs/components/ProgramEditor';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading: loadingStudent } = useStudent(id ?? '');
  const { data: programs, isLoading: loadingPrograms } = useStudentPrograms(id ?? '');

  if (!id) return null;
  if (loadingStudent || loadingPrograms) return <Spinner />;
  if (!student) return <EmptyState title="Alumno no encontrado" />;

  const activeProgram = programs?.find((p) => p.is_active);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-xl font-semibold">{student.full_name}</h1>
        <p className="text-sm text-neutral-500">
          Suscripción: {student.subscription_status === 'active' ? 'activa' : 'inactiva'}
        </p>
      </div>

      {activeProgram ? (
        <ProgramEditor programId={activeProgram.id} />
      ) : (
        <EmptyState title="Sin programa asignado" description="Asigná una plantilla desde /admin/plantillas." />
      )}
    </div>
  );
}
