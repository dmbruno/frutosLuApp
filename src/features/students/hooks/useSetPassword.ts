import { useMutation } from '@tanstack/react-query';
import { setPassword } from '../api';

export function useSetPassword() {
  return useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) => setPassword(userId, password),
  });
}
