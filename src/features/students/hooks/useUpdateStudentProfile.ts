import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentProfile, type EditableStudentFields } from '../api';

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: EditableStudentFields }) =>
      updateStudentProfile(userId, input),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['student', userId] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
