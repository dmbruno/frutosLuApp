import { Toggle } from '../../../components/ui';
import { useSubscription } from '../hooks/useSubscription';
import { useToast } from '../../../lib/ToastProvider';

interface SubscriptionToggleProps {
  userId: string;
  status: 'active' | 'inactive';
}

export function SubscriptionToggle({ userId, status }: SubscriptionToggleProps) {
  const { mutate, isPending } = useSubscription();
  const { showToast } = useToast();

  function handleChange(checked: boolean) {
    const newStatus = checked ? 'active' : 'inactive';
    mutate(
      { userId, status: newStatus },
      { onSuccess: () => showToast(newStatus === 'active' ? 'Suscripción activada' : 'Suscripción pausada') },
    );
  }

  return (
    <Toggle
      checked={status === 'active'}
      onChange={handleChange}
      label={isPending ? 'Actualizando…' : status === 'active' ? 'Activo' : 'Inactivo'}
    />
  );
}
