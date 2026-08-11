import { useAuth } from '../features/auth/hooks/useAuth';
import { useWeekView } from '../features/workout/hooks/useWeekView';
import { WeekView } from '../features/workout/components/WeekView';

export function WeekPage() {
  const { user } = useAuth();
  const { data: days, isLoading } = useWeekView(user?.id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <WeekView days={days} loading={isLoading} />
    </div>
  );
}
