import { useQuery } from '@tanstack/react-query';
import { getStudent } from '../api';

export function useStudent(userId: string) {
  return useQuery({
    queryKey: ['student', userId],
    queryFn: () => getStudent(userId),
    enabled: !!userId,
  });
}
