import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../../components/ui';
import { AdherenceLight } from './AdherenceLight';
import { SubscriptionToggle } from './SubscriptionToggle';
import type { Adherence } from '../../../types/domain';

interface StudentListProps {
  students: Adherence[] | undefined;
  loading: boolean;
}

export function StudentList({ students, loading }: StudentListProps) {
  if (loading) return <Spinner />;
  if (!students || students.length === 0) {
    return (
      <EmptyState title="Sin alumnos" description="Dalos de alta invitándolos por email desde Supabase Auth." />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {students.map((student) => (
        <Card key={student.user_id} className="flex items-center justify-between gap-3">
          <Link to={`/admin/alumnos/${student.user_id}`} className="flex min-w-0 flex-1 items-center gap-2">
            <AdherenceLight trafficLight={student.traffic_light} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{student.full_name}</p>
              <p className="text-xs text-neutral-500">{student.sessions_7d} sesiones esta semana</p>
            </div>
          </Link>
          <SubscriptionToggle userId={student.user_id} status={student.subscription_status} />
        </Card>
      ))}
    </div>
  );
}
