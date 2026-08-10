import { useAuth } from '../features/auth/hooks/useAuth';
import { useTodayWorkout } from '../features/workout/hooks/useTodayWorkout';
import { useWeekView } from '../features/workout/hooks/useWeekView';
import { TodayView } from '../features/workout/components/TodayView';
import { WeekdayPills } from '../features/workout/components/WeekdayPills';

export function TodayPage() {
  const { user } = useAuth();
  const { data: day, isLoading } = useTodayWorkout(user?.id);
  const { data: weekDays } = useWeekView(user?.id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-display text-2xl font-extrabold text-neutral-900">Hoy</h1>
      <WeekdayPills days={weekDays ?? []} todayDayId={day?.id ?? null} />
      <TodayView day={day} loading={isLoading} />
    </div>
  );
}
