import { useParams } from 'react-router-dom';
import { WorkoutSession } from '../features/workout/components/WorkoutSession';

export function WorkoutPage() {
  const { programDayId } = useParams<{ programDayId: string }>();
  if (!programDayId) return null;
  return <WorkoutSession programDayId={programDayId} />;
}
