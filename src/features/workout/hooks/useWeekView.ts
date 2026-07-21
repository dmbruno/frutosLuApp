import { useQuery } from '@tanstack/react-query';
import { getWeekView } from '../api';

export function useWeekView(userId: string | undefined) {
  return useQuery({
    queryKey: ['week-view', userId],
    queryFn: () => getWeekView(userId!),
    enabled: !!userId,
  });
}
