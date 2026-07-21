import { useMutation, useQueryClient } from '@tanstack/react-query';
import { renewSubscription } from '../api';

export function useRenewSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, days }: { userId: string; days: number }) => renewSubscription(userId, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
}
