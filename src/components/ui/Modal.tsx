import type { PropsWithChildren } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export function Modal({ open, onClose, children }: PropsWithChildren<ModalProps>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <button onClick={onClose} className="mb-4 text-sm text-neutral-500">
          Cerrar
        </button>
        {children}
      </div>
    </div>
  );
}
