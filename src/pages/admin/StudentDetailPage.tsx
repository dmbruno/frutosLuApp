import { useParams } from 'react-router-dom';
import { StudentDetail } from '../../features/students/components/StudentDetail';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <StudentDetail userId={id} />;
}
