import { Link } from 'react-router-dom';
import { Repeat } from 'lucide-react';
import { Button, EmptyState, Spinner } from '../../../components/ui';
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

  const blocks = EXERCISE_BLOCKS.map((block) => ({
    block,
    exercises: day.exercises.filter((e) => e.block === block),
  })).filter((b) => b.exercises.length > 0);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="p-4 pb-2">
        <p className="text-sm text-neutral-500">{day.completed ? 'Ya entrenado' : pendingLabel}</p>
        <h2 className="font-display text-2xl font-extrabold text-neutral-900">{day.title}</h2>
      </div>

      {blocks.map(({ block, exercises }) => {
        const uniformSets = getUniformSets(exercises);
        return (
          <div key={block}>
            <div className="h-2 bg-neutral-100" />
            <div className="px-4 pt-4 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">{BLOCK_LABELS[block]}</p>
                {uniformSets && (
                  <span className="flex items-center gap-1 text-sm font-semibold text-neutral-900">
                    <Repeat size={16} strokeWidth={2.25} />
                    {uniformSets} series
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {exercises.map((ex) => (
                  <ExerciseRow
                    key={ex.id}
                    exercise={ex}
                    repsLabel={uniformSets ? stripSetsPrefix(ex.sets_reps_text, uniformSets) : ex.sets_reps_text}
                  />
                ))}
              </div>
              <BlockVideoList exercises={exercises} />
            </div>
          </div>
        );
      })}

      <div className="p-4 pt-4">
        <Link to={`/entrenar/${day.id}`}>
          <Button className="w-full">{day.completed ? 'Repetir' : 'Empezar'}</Button>
        </Link>
      </div>
    </div>
  );
}
