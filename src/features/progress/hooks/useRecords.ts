import { useQuery } from '@tanstack/react-query';
import { getPersonalRecords } from '../api';

export function useRecords() {
  return useQuery({ queryKey: ['personal-records'], queryFn: getPersonalRecords });
}
