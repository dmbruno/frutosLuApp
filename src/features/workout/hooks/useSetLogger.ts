import { useCallback } from 'react';
import { logSet } from '../api';
import type { Database } from '../../../types/database';

type SetLogInsert = Database['public']['Tables']['set_logs']['Insert'];

export type SetLogStatus = 'saved' | 'error';

export function useSetLogger() {
  const submit = useCallback(async (input: Omit<SetLogInsert, 'id'>): Promise<SetLogStatus> => {
    const setLog: SetLogInsert = { ...input, id: crypto.randomUUID() };
    try {
      await logSet(setLog);
      return 'saved';
    } catch {
      return 'error';
    }
  }, []);

  return { submit };
}
