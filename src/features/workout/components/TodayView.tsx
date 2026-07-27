import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, Spinner } from '../../../components/ui';
import { EXERCISE_BLOCKS } from '../../exercises/constants';
import type { WeekDay } from '../../../types/domain';

interface TodayViewProps {
  day: WeekDay | null | undefined;
  loading: boolean;
  pendingLabel?: string;
}

export function TodayView({ day, loading, pendingLabel = 'Hoy toca' }: TodayViewProps) {
  if (loading) return <Spinner />;
  if (!day) {
    return <EmptyState title="Sin rutina activa" description="Pedile a tu profe que te asigne un programa." />;
  }

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">{day.completed ? 'Ya entrenado' : pendingLabel}</p>
      <h2 className="font-display text-xl font-semibold">{day.title}</h2>

      <div className="flex flex-col gap-4">
        {EXERCISE_BLOCKS.map((block) => {
          const exercisesInBlock = day.exercises.filter((e) => e.block === block);
          if (exercisesInBlock.length === 0) return null;
          return (
            <div key={block}>
              <p className="mb-1 border-b-2 border-brand-pink/20 pb-1 text-xs font-bold uppercase tracking-wide text-brand-pink">
                {block}
              </p>
              <div className="flex flex-col">
                {exercisesInBlock.map((ex) => (
                  <div key={ex.id} className="border-b border-neutral-100 py-2 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <span className="min-w-0 flex-1 text-sm text-neutral-700">
                        {ex.order_code && <span className="mr-1 font-mono text-xs text-neutral-400">{ex.order_code}</span>}
                        {ex.exercise.name}
                      </span>
                      <span className="shrink-0 text-sm font-medium text-neutral-500">{ex.sets_reps_text}</span>
                    </div>
                    {ex.coach_note && (
                      <p className="mt-1 rounded-lg bg-brand-amber/10 px-2 py-1 text-xs text-brand-amber">
                        {ex.coach_note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Link to={`/entrenar/${day.id}`}>
        <Button className="w-full">{day.completed ? 'Repetir' : 'Empezar'}</Button>
      </Link>
    </Card>
  );
}
