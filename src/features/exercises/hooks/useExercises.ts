import { useQuery } from '@tanstack/react-query';
import { listExercises } from '../api';

export function useExercises(search: string) {
  return useQuery({
    queryKey: ['exercises', search],
    queryFn: () => listExercises(search),
  });
}
