import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listMeasurements, addMeasurement } from '../api';
import type { Database } from '../../../types/database';

type BodyMetricInsert = Database['public']['Tables']['body_metrics']['Insert'];

export function useBodyMetrics(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['body-metrics', userId],
    queryFn: () => listMeasurements(userId),
    enabled: !!userId,
  });

  const add = useMutation({
    mutationFn: (input: BodyMetricInsert) => addMeasurement(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['body-metrics', userId] }),
  });

  return { measurements: query.data, loading: query.isLoading, add };
}
