import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logSet } from '../api';
import { enqueueSetLog } from '../offlineQueue';
import type { Database } from '../../../types/database';

type SetLogInsert = Database['public']['Tables']['set_logs']['Insert'];

export type SetLogStatus = 'saved' | 'queued';

export function useSetLogger() {
  const queryClient = useQueryClient();

  const submit = useCallback(
    async (input: Omit<SetLogInsert, 'id'>): Promise<SetLogStatus> => {
      const setLog: SetLogInsert = { ...input, id: crypto.randomUUID() };
      try {
        await logSet(setLog);
        return 'saved';
      } catch {
        await enqueueSetLog(setLog);
        return 'queued';
      } finally {
        // Invalida el cache de "series ya registradas" de la sesión: si el
        // alumno sale y vuelve a entrar antes de que expire el staleTime,
        // debe ver la serie recién marcada sin necesitar un refresh manual.
        queryClient.invalidateQueries({ queryKey: ['session-set-logs', input.session_id] });
      }
    },
    [queryClient],
  );

  return { submit };
}
