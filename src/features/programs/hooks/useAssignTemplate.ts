import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignTemplate } from '../api';

interface AssignTemplateInput {
  templateId: string;
  userId: string;
  startsOn: string;
}

export function useAssignTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, userId, startsOn }: AssignTemplateInput) =>
      assignTemplate(templateId, userId, startsOn),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student-programs', variables.userId] });
    },
  });
}
