import { useQuery } from '@tanstack/react-query';
import { listExercises } from '../api';
import type { ExerciseBlock } from '../../../types/database';

export function useExercises(search: string, block?: ExerciseBlock) {
  return useQuery({
    queryKey: ['exercises', search, block],
    queryFn: () => listExercises(search, block),
  });
}
