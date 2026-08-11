import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOwnProfile, type EditableOwnProfileFields } from '../api';

export function useUpdateOwnProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: EditableOwnProfileFields }) =>
      updateOwnProfile(userId, input),
    onSuccess: (_data, { userId }) => queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
  });
}
