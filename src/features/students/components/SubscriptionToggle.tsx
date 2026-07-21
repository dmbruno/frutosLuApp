import { Toggle } from '../../../components/ui';
import { useSubscription } from '../hooks/useSubscription';

interface SubscriptionToggleProps {
  userId: string;
  status: 'active' | 'inactive';
}

export function SubscriptionToggle({ userId, status }: SubscriptionToggleProps) {
  const { mutate, isPending } = useSubscription();

  return (
    <Toggle
      checked={status === 'active'}
      onChange={(checked) => mutate({ userId, status: checked ? 'active' : 'inactive' })}
      label={isPending ? 'Actualizando…' : status === 'active' ? 'Activa' : 'Inactiva'}
    />
  );
}
