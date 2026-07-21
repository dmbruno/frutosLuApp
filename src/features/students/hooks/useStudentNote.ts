import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudentNote, setStudentNote } from '../api';

export function useStudentNote(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['student-note', userId],
    queryFn: () => getStudentNote(userId),
    enabled: !!userId,
  });

  const save = useMutation({
    mutationFn: (note: string) => setStudentNote(userId, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['student-note', userId] }),
  });

  return { note: query.data, loading: query.isLoading, save };
}
