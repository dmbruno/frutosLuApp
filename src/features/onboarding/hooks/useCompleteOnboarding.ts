import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding, type OnboardingData } from '../api';

export function useCompleteOnboarding(userId: string | undefined) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: OnboardingData) => completeOnboarding(userId!, data),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });

  return { complete: mutation.mutateAsync, isPending: mutation.isPending };
}
