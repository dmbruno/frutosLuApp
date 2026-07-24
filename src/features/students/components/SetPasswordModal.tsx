import { useState } from 'react';
import { Button, Modal, PasswordInput } from '../../../components/ui';
import { useSetPassword } from '../hooks/useSetPassword';
import { useToast } from '../../../lib/ToastProvider';
import { generatePassword } from '../../../lib/utils/password';

interface SetPasswordModalProps {
  open: boolean;
  userId: string;
  studentName: string;
  onClose: () => void;
}

export function SetPasswordModal({ open, userId, studentName, onClose }: SetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const setPasswordMutation = useSetPassword();
  const { showToast } = useToast();

  function handleSubmit() {
    setPasswordMutation.mutate(
      { userId, password },
      {
        onSuccess: () => {
          showToast(`Contraseña de ${studentName} actualizada`);
          onClose();
          setPassword('');
        },
        onError: (err) => showToast(err instanceof Error ? err.message : 'No pudimos cambiar la contraseña'),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-lg font-semibold">Restablecer contraseña de {studentName}</p>
        <div className="flex gap-2">
          <PasswordInput
            className="flex-1"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="shrink-0 cursor-pointer rounded-xl border border-neutral-300 px-3 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            Generar
          </button>
        </div>
        <Button onClick={handleSubmit} disabled={password.length < 6 || setPasswordMutation.isPending}>
          {setPasswordMutation.isPending ? 'Guardando…' : 'Guardar nueva contraseña'}
        </Button>
      </div>
    </Modal>
  );
}
