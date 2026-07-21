import { useQuery } from '@tanstack/react-query';
import { getSessionSummary } from '../api';

export function useSessionSummary(sessionId: string, startedAt: string) {
  return useQuery({
    queryKey: ['session-summary', sessionId],
    queryFn: () => getSessionSummary(sessionId, startedAt),
  });
}
