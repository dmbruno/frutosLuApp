import { useQuery } from '@tanstack/react-query';
import { getRecentActivity } from '../api';

export function useRecentActivity() {
  return useQuery({ queryKey: ['dashboard', 'recent-activity'], queryFn: getRecentActivity });
}
