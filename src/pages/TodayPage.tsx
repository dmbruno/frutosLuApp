import { useAuth } from '../features/auth/hooks/useAuth';
import { useTodayWorkout } from '../features/workout/hooks/useTodayWorkout';
import { TodayView } from '../features/workout/components/TodayView';

export function TodayPage() {
  const { user } = useAuth();
  const { data: day, isLoading } = useTodayWorkout(user?.id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-display text-2xl font-semibold text-brand-pink">Hoy</h1>
      <TodayView day={day} loading={isLoading} />
    </div>
  );
}
