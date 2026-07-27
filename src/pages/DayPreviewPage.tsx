import { useParams } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useWeekView } from '../features/workout/hooks/useWeekView';
import { TodayView } from '../features/workout/components/TodayView';

export function DayPreviewPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const { user } = useAuth();
  const { data: days, isLoading } = useWeekView(user?.id);
  const day = days?.find((d) => d.id === dayId);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <TodayView day={day} loading={isLoading} pendingLabel="Vista previa" />
    </div>
  );
}
