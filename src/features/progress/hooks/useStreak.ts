import { useQuery } from '@tanstack/react-query';
import { getStreak } from '../api';

export function useStreak() {
  return useQuery({ queryKey: ['streak'], queryFn: getStreak });
}
