import { openDB, type IDBPDatabase } from 'idb';
import { logSet } from './api';
import type { Database } from '../../types/database';

type SetLogInsert = Database['public']['Tables']['set_logs']['Insert'];

const DB_NAME = 'frutoslu-offline';
const STORE_NAME = 'pending-set-logs';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

export async function enqueueSetLog(setLog: SetLogInsert): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, setLog);
}

export async function flushQueue(): Promise<void> {
  const db = await getDb();
  const pending: SetLogInsert[] = await db.getAll(STORE_NAME);
  for (const setLog of pending) {
    try {
      await logSet(setLog);
      await db.delete(STORE_NAME, setLog.id as string);
    } catch {
      // sigue en cola; se reintenta en el próximo flush (online u apertura de la app)
    }
  }
}

export function registerOfflineQueueSync(): void {
  window.addEventListener('online', () => {
    flushQueue();
  });
  flushQueue();
}
