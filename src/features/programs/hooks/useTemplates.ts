import { useQuery } from '@tanstack/react-query';
import { listTemplates } from '../api';

export function useTemplates() {
  return useQuery({ queryKey: ['templates'], queryFn: listTemplates });
}
