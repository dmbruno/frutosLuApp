import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from 'react';

interface PendingChangesContextValue {
  registerPending: (key: string, commit: () => Promise<unknown>) => void;
  clearPending: (key: string) => void;
  hasPending: boolean;
  saving: boolean;
  saveAll: () => Promise<void>;
}

const PendingChangesContext = createContext<PendingChangesContextValue | null>(null);

export function PendingChangesProvider({ children }: PropsWithChildren) {
  const pendingRef = useRef<Map<string, () => Promise<unknown>>>(new Map());
  const [pendingCount, setPendingCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const registerPending = useCallback((key: string, commit: () => Promise<unknown>) => {
    pendingRef.current.set(key, commit);
    setPendingCount(pendingRef.current.size);
  }, []);

  const clearPending = useCallback((key: string) => {
    pendingRef.current.delete(key);
    setPendingCount(pendingRef.current.size);
  }, []);

  const saveAll = useCallback(async () => {
    const commits = Array.from(pendingRef.current.values());
    if (commits.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(commits.map((commit) => commit()));
      pendingRef.current.clear();
      setPendingCount(0);
    } finally {
      setSaving(false);
    }
  }, []);

  const value = useMemo(
    () => ({ registerPending, clearPending, hasPending: pendingCount > 0, saving, saveAll }),
    [registerPending, clearPending, pendingCount, saving, saveAll],
  );

  return <PendingChangesContext.Provider value={value}>{children}</PendingChangesContext.Provider>;
}

// Devuelve null fuera de un <PendingChangesProvider> a propósito: los campos
// que lo usan caen a su guardado instantáneo de siempre cuando no hay
// provider (ej. el editor de plantillas standalone en /admin/plantillas/:id).
export function usePendingChanges() {
  return useContext(PendingChangesContext);
}
