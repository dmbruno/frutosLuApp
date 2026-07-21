import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="flex flex-col gap-3 text-center">
        <p className="font-display text-lg font-semibold">{title}</p>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
        <div className="flex gap-2">
          <Button onClick={onCancel} className="flex-1 bg-neutral-200 text-neutral-700">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-red-500">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
