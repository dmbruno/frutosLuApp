import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Card, EmptyState, Spinner } from '../components/ui';
import { useReplacementDays } from '../features/workout/hooks/useReplacementDays';
import { DAY_FORMAT_LABELS } from '../features/programs/constants';
import type { DayWithExercises } from '../types/domain';

function equipmentSummary(day: DayWithExercises): string {
  const items = day.equipment_items ?? [];
  if (items.length === 0) return 'Sin elementos';
  if (items.length <= 2) return items.join(', ');
  return `${items.length} elementos`;
}

export function ReplacementsPage() {
  const { data: days, isLoading } = useReplacementDays();

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold text-neutral-900">Reemplazos</h2>
        <p className="text-sm text-neutral-500">Elegí una rutina para hoy en vez de la que te toca.</p>
      </div>

      {isLoading ? (
        <Spinner />
      ) : !days || days.length === 0 ? (
        <EmptyState
          title="Todavía no hay reemplazos"
          description="Tu profe todavía no cargó ninguna rutina alternativa."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {days.map((day) => (
            <Link key={day.id} to={`/entrenar/${day.id}`}>
              <Card className="flex items-center gap-3 transition-opacity hover:opacity-80">
                {day.cover_image_url ? (
                  <img src={day.cover_image_url} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-3xl text-neutral-400">
                    🏋️
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display line-clamp-2 text-base font-extrabold leading-snug text-neutral-900">
                    {day.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-neutral-500">
                    {DAY_FORMAT_LABELS[day.format ?? 'tradicional']} · {equipmentSummary(day)}
                  </p>
                  {day.duration_min != null && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-neutral-700">
                      <Clock size={12} className="shrink-0" />
                      {day.duration_min} min
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
