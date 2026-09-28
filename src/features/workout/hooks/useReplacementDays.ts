import { useQuery } from '@tanstack/react-query';
import { listReplacementDays } from '../../programs/api';

// Lectura para el alumno de la biblioteca de reemplazos (misma query que usa
// el admin en features/programs, ver listReplacementDays).
export function useReplacementDays() {
  return useQuery({ queryKey: ['replacement-days'], queryFn: listReplacementDays });
}
