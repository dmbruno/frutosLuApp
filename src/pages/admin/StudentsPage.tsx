import { StudentList } from '../../features/students/components/StudentList';
import { useStudents } from '../../features/students/hooks/useStudents';

export function StudentsPage() {
  const { data: students, isLoading } = useStudents();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-xl font-semibold">Alumnos</h1>
      <StudentList students={students} loading={isLoading} />
    </div>
  );
}
