import { usePendingChanges } from '../../lib/PendingChangesContext';
import { useToast } from '../../lib/ToastProvider';
import { Button } from './Button';

export function PendingChangesBar() {
  const pending = usePendingChanges();
  const { showToast } = useToast();

  if (!pending || !pending.hasPending) return null;

  async function handleSave() {
    try {
      await pending!.saveAll();
      showToast('Cambios guardados');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No pudimos guardar los cambios');
    }
  }

  return (
    <div className="fixed inset-x-4 bottom-[50px] z-30 md:inset-x-auto md:right-6 md:bottom-6 md:w-72">
      <Button onClick={handleSave} disabled={pending.saving} className="w-full shadow-lg">
        {pending.saving ? 'Guardando…' : 'Guardar cambios'}
      </Button>
    </div>
  );
}
