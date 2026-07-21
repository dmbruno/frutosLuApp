import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listTemplates, createTemplate, deleteTemplate } from '../api';

export function useTemplates() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['templates'], queryFn: listTemplates });

  const create = useMutation({
    mutationFn: (name: string) => createTemplate(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['templates'] }),
  });

  return { ...query, create, remove };
}
