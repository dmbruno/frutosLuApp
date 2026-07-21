import { useQuery } from '@tanstack/react-query';
import { getLastPerformances } from '../api';

export function useLastPerformance(programExerciseId: string) {
  return useQuery({
    queryKey: ['last-performance', programExerciseId],
    queryFn: () => getLastPerformances(programExerciseId),
  });
}
