import { useQuery } from '@tanstack/react-query';
import { getRecentPRs } from '../api';

export function useRecentPRs() {
  return useQuery({ queryKey: ['dashboard', 'recent-prs'], queryFn: getRecentPRs });
}
