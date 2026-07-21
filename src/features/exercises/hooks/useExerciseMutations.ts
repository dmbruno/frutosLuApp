import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExercise, updateExercise, archiveExercise } from '../api';
import type { Database } from '../../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
type ExerciseUpdate = Database['public']['Tables']['exercises']['Update'];

export function useExerciseMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['exercises'] });

  const create = useMutation({
    mutationFn: (input: ExerciseInsert) => createExercise(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ExerciseUpdate }) => updateExercise(id, input),
    onSuccess: invalidate,
  });

  const archive = useMutation({
    mutationFn: (id: string) => archiveExercise(id),
    onSuccess: invalidate,
  });

  return { create, update, archive };
}
