import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, type CreateUserInput } from '../api';

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });
}
