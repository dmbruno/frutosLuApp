import { useQuery } from '@tanstack/react-query';
import { getWeeklyHighlights } from '../api';

export function useWeeklyHighlights() {
  return useQuery({ queryKey: ['dashboard', 'weekly-highlights'], queryFn: getWeeklyHighlights });
}
