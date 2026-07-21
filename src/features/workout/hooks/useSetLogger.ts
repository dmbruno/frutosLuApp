import { useCallback } from 'react';
import { logSet } from '../api';
import { enqueueSetLog } from '../offlineQueue';
import type { Database } from '../../../types/database';

type SetLogInsert = Database['public']['Tables']['set_logs']['Insert'];

export type SetLogStatus = 'saved' | 'queued';

export function useSetLogger() {
  const submit = useCallback(async (input: Omit<SetLogInsert, 'id'>): Promise<SetLogStatus> => {
    const setLog: SetLogInsert = { ...input, id: crypto.randomUUID() };
    try {
      await logSet(setLog);
      return 'saved';
    } catch {
      await enqueueSetLog(setLog);
      return 'queued';
    }
  }, []);

  return { submit };
}
