import { useQuery } from '@tanstack/react-query';
import { getMuscleVolume, type RangeKind } from '../api';

export function useMuscleVolume(userId: string | undefined, range: RangeKind) {
  return useQuery({
    queryKey: ['muscle-volume', userId, range],
    queryFn: () => getMuscleVolume(userId!, range),
    enabled: !!userId,
  });
}
