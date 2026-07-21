import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, Spinner } from '../../../components/ui';
import type { WeekDay } from '../../../types/domain';

interface TodayViewProps {
  day: WeekDay | null | undefined;
  loading: boolean;
}

export function TodayView({ day, loading }: TodayViewProps) {
  if (loading) return <Spinner />;
  if (!day) {
    return <EmptyState title="Sin rutina activa" description="Pedile a tu profe que te asigne un programa." />;
  }

  const coachNote = day.exercises.find((e) => e.coach_note)?.coach_note;

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">{day.completed ? 'Ya entrenaste hoy' : 'Hoy toca'}</p>
      <h2 className="font-display text-xl font-semibold">{day.title}</h2>
      <p className="text-sm text-neutral-500">{day.exercises.length} ejercicios</p>
      {coachNote && <p className="rounded-lg bg-brand-amber/10 p-2 text-sm text-brand-amber">{coachNote}</p>}
      <Link to={`/entrenar/${day.id}`}>
        <Button className="w-full">{day.completed ? 'Repetir' : 'Empezar'}</Button>
      </Link>
    </Card>
  );
}
