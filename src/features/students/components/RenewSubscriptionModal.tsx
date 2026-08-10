import { useState } from 'react';
import { Button, Input, Modal } from '../../../components/ui';
import { useRenewSubscription } from '../hooks/useRenewSubscription';
import { useToast } from '../../../lib/ToastProvider';

interface RenewSubscriptionModalProps {
  open: boolean;
  userId: string;
  studentName: string;
  onClose: () => void;
}

export function RenewSubscriptionModal({ open, userId, studentName, onClose }: RenewSubscriptionModalProps) {
  const [days, setDays] = useState('30');
  const renew = useRenewSubscription();
  const { showToast } = useToast();

  function handleSubmit() {
    renew.mutate(
      { userId, days: Number(days) },
      {
        onSuccess: () => {
          showToast(`Plan de ${studentName} renovado por ${days} días`);
          onClose();
        },
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-lg font-extrabold text-neutral-900">Renovar a {studentName}</p>
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Días de acceso
          <Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
        </label>
        <Button onClick={handleSubmit} disabled={!days || renew.isPending}>
          {renew.isPending ? 'Renovando…' : 'Renovar'}
        </Button>
      </div>
    </Modal>
  );
}
