import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { startSession, getProgramDay, finishSession as finishSessionApi } from '../api';
import type { WorkoutSession } from '../../../types/domain';

export function useWorkoutSession(programDayId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<WorkoutSession | null>(null);

  const dayQuery = useQuery({
    queryKey: ['program-day', programDayId],
    queryFn: () => getProgramDay(programDayId),
    enabled: !!programDayId,
  });

  useEffect(() => {
    if (!user) return;
    startSession(user.id, programDayId).then(setSession);
  }, [user, programDayId]);

  async function finish(feeling: number, note: string | null) {
    if (!session) return;
    await finishSessionApi(session.id, feeling, note);
    queryClient.invalidateQueries({ queryKey: ['today-workout'] });
    queryClient.invalidateQueries({ queryKey: ['week-view'] });
  }

  return {
    day: dayQuery.data,
    loading: dayQuery.isLoading || !session,
    session,
    finish,
  };
}
