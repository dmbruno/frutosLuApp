import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteStudent } from '../api';

export function useInviteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, fullName, days }: { email: string; fullName: string; days: number }) =>
      inviteStudent(email, fullName, days),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });
}
