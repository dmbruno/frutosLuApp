import { useQuery } from '@tanstack/react-query';
import { getStudentDetail } from '../api';

export function useStudentDetail(userId: string) {
  return useQuery({
    queryKey: ['student', userId],
    queryFn: () => getStudentDetail(userId),
    enabled: !!userId,
  });
}
