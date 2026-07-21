import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '../api';

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteStudent(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });
}
