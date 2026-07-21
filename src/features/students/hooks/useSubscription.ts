import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSubscription } from '../api';

export function useSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' }) =>
      setSubscription(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
}
