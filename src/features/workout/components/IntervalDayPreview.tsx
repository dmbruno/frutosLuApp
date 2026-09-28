import { Clock, Dumbbell, Layers } from 'lucide-react';
import { ExerciseRow } from './ExerciseRow';
import type { DayWithExercises } from '../../../types/domain';

interface IntervalDayPreviewProps {
  day: DayWithExercises;
}

// Vista previa de un día "intervalos" (circuito/HIIT a tiempo, en vez de series
// x reps): duración + elementos arriba, y la lista de ejercicios del circuito
// en el orden en que se hacen, sin el agrupado por bloque de un día tradicional.
export function IntervalDayPreview({ day }: IntervalDayPreviewProps) {
  const exercises = [...day.exercises].sort((a, b) => a.position - b.position);
  const equipmentItems = day.equipment_items ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-neutral-100 px-4 py-3">
        {day.duration_min != null && (
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <Clock size={16} className="shrink-0 text-neutral-400" />
            {day.duration_min} minutos
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <Layers size={16} className="shrink-0 text-neutral-400" />
          Circuito de intervalos
        </div>
        {equipmentItems.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-neutral-700">
            <Dumbbell size={16} className="mt-0.5 shrink-0 text-neutral-400" />
            <span>{equipmentItems.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Preparación</p>
        {exercises.map((ex) => (
          <ExerciseRow key={ex.id} exercise={ex} repsLabel={ex.sets_reps_text} />
        ))}
      </div>
    </div>
  );
}
