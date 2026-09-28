import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getReplacementDay,
  updateDay,
  createProgramExercise,
  updateProgramExercise,
  deleteProgramExercise,
  uploadReplacementCoverImage,
} from '../api';
import type { Database } from '../../../types/database';

type ProgramDayUpdate = Database['public']['Tables']['program_days']['Update'];
type ProgramExerciseInsert = Database['public']['Tables']['program_exercises']['Insert'];
type ProgramExerciseUpdate = Database['public']['Tables']['program_exercises']['Update'];

export function useReplacementDayEditor(dayId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['replacement-day', dayId],
    queryFn: () => getReplacementDay(dayId),
    enabled: !!dayId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['replacement-day', dayId] });

  const editDay = useMutation({
    mutationFn: (input: ProgramDayUpdate) => updateDay(dayId, input),
    onSuccess: invalidate,
  });

  const addExercise = useMutation({
    mutationFn: (input: ProgramExerciseInsert) => createProgramExercise(input),
    onSuccess: invalidate,
  });

  const editExercise = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProgramExerciseUpdate }) => updateProgramExercise(id, input),
    onSuccess: invalidate,
  });

  const removeExercise = useMutation({
    mutationFn: (id: string) => deleteProgramExercise(id),
    onSuccess: invalidate,
  });

  const uploadCoverImage = useMutation({
    mutationFn: (file: File) => uploadReplacementCoverImage(file),
  });

  return {
    day: query.data,
    loading: query.isLoading,
    error: query.isError,
    editDay,
    addExercise,
    editExercise,
    removeExercise,
    uploadCoverImage,
  };
}
