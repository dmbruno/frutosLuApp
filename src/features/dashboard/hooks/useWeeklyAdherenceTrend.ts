import { useQuery } from '@tanstack/react-query';
import { getWeeklyAdherenceTrend } from '../api';

export function useWeeklyAdherenceTrend() {
  return useQuery({ queryKey: ['dashboard', 'weekly-adherence-trend'], queryFn: getWeeklyAdherenceTrend });
}
