import { Link } from 'react-router-dom';
import { Button, EmptyState, Spinner } from '../../../components/ui';
import { EXERCISE_BLOCKS } from '../../exercises/constants';
import { groupBySuperset } from '../../../lib/utils/supersets';
import { ExerciseBlockCard } from './ExerciseBlockCard';
import type { WeekDay } from '../../../types/domain';

interface TodayViewProps {
  day: WeekDay | null | undefined;
  loading: boolean;
  pendingLabel?: string;
}

const BLOCK_LABELS: Record<string, string> = {
  movilidad: 'Movilidad',
  core: 'Core',
  estructura: 'Estructura',
  cardio: 'Cardio',
  otro: 'Otro',
};

export function TodayView({ day, loading, pendingLabel = 'Hoy toca' }: TodayViewProps) {
  if (loading) return <Spinner />;
  if (!day) {
    return <EmptyState title="Sin rutina activa" description="Pedile a tu profe que te asigne un programa." />;
  }

  const blocks = EXERCISE_BLOCKS.map((block) => ({
    block,
    exercises: day.exercises.filter((e) => e.block === block),
  })).filter((b) => b.exercises.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm text-neutral-500">{day.completed ? 'Ya entrenado' : pendingLabel}</p>
        <h2 className="font-display text-2xl font-extrabold text-neutral-900">{day.title}</h2>
      </div>

      {blocks.map(({ block, exercises }) => {
        const supersetGroups = groupBySuperset(exercises);
        const hasSupersets = supersetGroups.some((g) => g.length > 1);

        if (!hasSupersets) {
          return <ExerciseBlockCard key={block} title={BLOCK_LABELS[block]} exercises={exercises} />;
        }

        return supersetGroups.map((group) => (
          <ExerciseBlockCard
            key={group[0].id}
            title={BLOCK_LABELS[block]}
            subtitle={group[0].superset_group ? `Bloque ${group[0].superset_group}` : undefined}
            exercises={group}
          />
        ));
      })}

      <Link to={`/entrenar/${day.id}`}>
        <Button className="w-full">{day.completed ? 'Repetir' : 'Comenzar entrenamiento'}</Button>
      </Link>
    </div>
  );
}
