import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createExercise,
  updateExercise,
  archiveExercise,
  reactivateExercise,
  deleteExercise,
  uploadExerciseThumbnail,
} from '../api';
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

  const reactivate = useMutation({
    mutationFn: (id: string) => reactivateExercise(id),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteExercise(id),
    onSuccess: invalidate,
  });

  const uploadThumbnail = useMutation({
    mutationFn: (file: File) => uploadExerciseThumbnail(file),
  });

  return { create, update, archive, reactivate, remove, uploadThumbnail };
}
