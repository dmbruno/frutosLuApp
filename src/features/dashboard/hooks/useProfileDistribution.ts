import { useQuery } from '@tanstack/react-query';
import { getProfileDistribution } from '../api';

export function useProfileDistribution() {
  return useQuery({ queryKey: ['dashboard', 'profile-distribution'], queryFn: getProfileDistribution });
}
