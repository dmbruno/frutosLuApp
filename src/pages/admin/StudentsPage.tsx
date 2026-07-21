import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../components/ui';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();

  if (isLoading) return <Spinner />;
  if (!students || students.length === 0) {
    return (
      <EmptyState title="Sin alumnos" description="Dalos de alta invitándolos por email desde Supabase Auth." />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-xl font-semibold">Alumnos</h1>
      <div className="flex flex-col gap-2">
        {students.map((student) => (
          <Link key={student.id} to={`/admin/alumnos/${student.id}`}>
            <Card className="hover:shadow-md">
              <p className="font-medium">{student.full_name}</p>
              <p className="text-sm text-neutral-500">
                {student.subscription_status === 'active' ? 'Suscripción activa' : 'Suscripción inactiva'}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
