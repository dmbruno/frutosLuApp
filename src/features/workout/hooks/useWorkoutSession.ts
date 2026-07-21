import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { startSession, getProgramDay, finishSession as finishSessionApi } from '../api';

export function useWorkoutSession(programDayId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const dayQuery = useQuery({
    queryKey: ['program-day', programDayId],
    queryFn: () => getProgramDay(programDayId),
    enabled: !!programDayId,
  });

  useEffect(() => {
    if (!user) return;
    startSession(user.id, programDayId).then((session) => setSessionId(session.id));
  }, [user, programDayId]);

  async function finish(feeling: number, note: string | null) {
    if (!sessionId) return;
    await finishSessionApi(sessionId, feeling, note);
    queryClient.invalidateQueries({ queryKey: ['today-workout'] });
    queryClient.invalidateQueries({ queryKey: ['week-view'] });
  }

  return {
    day: dayQuery.data,
    loading: dayQuery.isLoading || !sessionId,
    sessionId,
    finish,
  };
}
