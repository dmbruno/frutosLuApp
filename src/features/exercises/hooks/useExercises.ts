import { useQuery } from '@tanstack/react-query';
import { listExercises } from '../api';
import type { ExerciseBlock } from '../../../types/database';

export function useExercises(search: string, block?: ExerciseBlock, archived = false) {
  return useQuery({
    queryKey: ['exercises', search, block, archived],
    queryFn: () => listExercises(search, block, archived),
  });
}
