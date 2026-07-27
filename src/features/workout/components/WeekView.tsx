import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../../components/ui';
import type { WeekDay } from '../../../types/domain';

interface WeekViewProps {
  days: WeekDay[] | undefined;
  loading: boolean;
}

export function WeekView({ days, loading }: WeekViewProps) {
  if (loading) return <Spinner />;
  if (!days || days.length === 0) {
    return <EmptyState title="Sin rutina activa" description="Pedile a tu profe que te asigne un programa." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {days.map((day) => (
        <Link key={day.id} to={`/semana/${day.id}`} className="block transition-opacity hover:opacity-70">
          <Card className="flex items-center justify-between">
            <div>
              <p className="font-medium">{day.title}</p>
              <p className="text-sm text-neutral-500">{day.exercises.length} ejercicios</p>
            </div>
            <span className={day.completed ? 'text-lg text-green-500' : 'text-lg text-neutral-300'}>✓</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
