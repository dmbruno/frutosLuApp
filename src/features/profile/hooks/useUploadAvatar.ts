import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAvatar } from '../api';

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) => uploadAvatar(userId, file),
    onSuccess: (_data, { userId }) => queryClient.invalidateQueries({ queryKey: ['profile', userId] }),
  });
}
