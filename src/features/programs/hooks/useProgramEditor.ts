import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProgramFull,
  createDay,
  updateDay,
  deleteDay,
  createProgramExercise,
  updateProgramExercise,
  deleteProgramExercise,
  updateProgram,
} from '../api';
import type { Database } from '../../../types/database';

type ProgramDayInsert = Database['public']['Tables']['program_days']['Insert'];
type ProgramDayUpdate = Database['public']['Tables']['program_days']['Update'];
type ProgramExerciseInsert = Database['public']['Tables']['program_exercises']['Insert'];
type ProgramExerciseUpdate = Database['public']['Tables']['program_exercises']['Update'];
type ProgramUpdate = Database['public']['Tables']['programs']['Update'];

export function useProgramEditor(programId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['program-full', programId],
    queryFn: () => getProgramFull(programId),
    enabled: !!programId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['program-full', programId] });

  const addDay = useMutation({
    mutationFn: (input: ProgramDayInsert) => createDay(input),
    onSuccess: invalidate,
  });

  const editDay = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProgramDayUpdate }) => updateDay(id, input),
    onSuccess: invalidate,
  });

  const removeDay = useMutation({
    mutationFn: (id: string) => deleteDay(id),
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

  const editProgram = useMutation({
    mutationFn: (input: ProgramUpdate) => updateProgram(programId, input),
    onSuccess: invalidate,
  });

  return {
    program: query.data,
    loading: query.isLoading,
    error: query.isError,
    addDay,
    editDay,
    removeDay,
    addExercise,
    editExercise,
    removeExercise,
    editProgram,
  };
}
