import { useQuery } from '@tanstack/react-query';
import { listStudentPrograms } from '../api';

export function useStudentPrograms(userId: string) {
  return useQuery({
    queryKey: ['student-programs', userId],
    queryFn: () => listStudentPrograms(userId),
    enabled: !!userId,
  });
}
