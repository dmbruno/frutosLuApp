import { useMemo } from 'react';
import { useStudents } from './useStudents';

export function useAdherence() {
  const studentsQuery = useStudents();

  const summary = useMemo(() => {
    const counts = { verde: 0, amarillo: 0, rojo: 0 };
    for (const student of studentsQuery.data ?? []) {
      counts[student.traffic_light as keyof typeof counts] += 1;
    }
    return counts;
  }, [studentsQuery.data]);

  return { ...studentsQuery, summary };
}
