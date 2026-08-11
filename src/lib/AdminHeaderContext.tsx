import { createContext, useContext, useEffect, useState, type PropsWithChildren, type ReactNode } from 'react';

interface AdminHeaderContextValue {
  action: ReactNode;
  setAction: (node: ReactNode) => void;
}

const AdminHeaderContext = createContext<AdminHeaderContextValue | null>(null);

export function AdminHeaderProvider({ children }: PropsWithChildren) {
  const [action, setAction] = useState<ReactNode>(null);
  return <AdminHeaderContext.Provider value={{ action, setAction }}>{children}</AdminHeaderContext.Provider>;
}

// Cada página registra el botón que quiere ver dentro de la barra negra del
// header en mobile. El nodo debe llegar memoizado (useMemo) desde quien lo
// llama para no reactivar el efecto en cada render.
export function useAdminHeaderAction(node: ReactNode) {
  const ctx = useContext(AdminHeaderContext);
  const setAction = ctx?.setAction;
  useEffect(() => {
    setAction?.(node);
    return () => setAction?.(null);
  }, [node, setAction]);
}

export function useAdminHeaderActionValue(): ReactNode {
  return useContext(AdminHeaderContext)?.action ?? null;
}
