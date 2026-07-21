import { useQuery } from '@tanstack/react-query';
import { getTodayWorkout } from '../api';

export function useTodayWorkout(userId: string | undefined) {
  return useQuery({
    queryKey: ['today-workout', userId],
    queryFn: () => getTodayWorkout(userId!),
    enabled: !!userId,
  });
}
