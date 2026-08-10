import type { PropsWithChildren } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export function Modal({ open, onClose, children }: PropsWithChildren<ModalProps>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <button
          onClick={onClose}
          className="mb-4 shrink-0 cursor-pointer text-sm text-neutral-500 transition-colors hover:text-neutral-700"
        >
          Cerrar
        </button>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
