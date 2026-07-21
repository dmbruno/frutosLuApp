import { useQuery } from '@tanstack/react-query';
import { listStudents } from '../api';

export function useStudents() {
  return useQuery({ queryKey: ['students'], queryFn: listStudents });
}
