import { Link } from 'react-router-dom';
import { Button, Card, EmptyState, Spinner } from '../../../components/ui';
import { EXERCISE_BLOCKS } from '../../exercises/constants';
import { getUniformSets, stripSetsPrefix } from '../../../lib/utils/blockSummary';
import { ExerciseRow } from './ExerciseRow';
import { BlockVideoList } from './BlockVideoList';
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

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-neutral-500">{day.completed ? 'Ya entrenado' : pendingLabel}</p>
      <h2 className="font-display text-xl font-semibold">{day.title}</h2>

      <div className="flex flex-col gap-3">
        {EXERCISE_BLOCKS.map((block) => {
          const exercisesInBlock = day.exercises.filter((e) => e.block === block);
          if (exercisesInBlock.length === 0) return null;
          const uniformSets = getUniformSets(exercisesInBlock);

          return (
            <div key={block} className="rounded-2xl bg-neutral-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-brand-pink">{BLOCK_LABELS[block]}</p>
                {uniformSets && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-pink/10 px-3 py-1.5 text-xs font-semibold text-brand-pink">
                    🔁 {uniformSets} series
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {exercisesInBlock.map((ex) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    repsLabel={uniformSets ? stripSetsPrefix(ex.sets_reps_text, uniformSets) : ex.sets_reps_text}
                  />
                ))}
              </div>

              <BlockVideoList exercises={exercisesInBlock} />
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
