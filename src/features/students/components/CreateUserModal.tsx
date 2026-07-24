import { useState } from 'react';
import { Button, Input, Modal, PasswordInput } from '../../../components/ui';
import { useCreateUser } from '../hooks/useCreateUser';
import { useToast } from '../../../lib/ToastProvider';
import { generatePassword } from '../../../lib/utils/password';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateUserModal({ open, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'alumno' | 'admin'>('alumno');
  const [days, setDays] = useState('30');
  const createUser = useCreateUser();
  const { showToast } = useToast();

  function reset() {
    setEmail('');
    setFullName('');
    setPassword('');
    setRole('alumno');
    setDays('30');
  }

  function handleSubmit() {
    createUser.mutate(
      { email, fullName, password, role, days: role === 'alumno' ? Number(days) : undefined },
      {
        onSuccess: () => {
          showToast(`Usuario "${fullName}" creado`);
          onClose();
          reset();
        },
        onError: (err) => showToast(err instanceof Error ? err.message : 'No pudimos crear el usuario'),
      },
    );
  }

  const canSubmit = !!email && !!fullName && password.length >= 6 && (role === 'admin' || Number(days) > 0);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-lg font-semibold">Nuevo usuario</p>
        <Input placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Contraseña
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
              className="shrink-0 rounded-xl border border-neutral-300 px-3 text-sm text-neutral-600"
            >
              Generar
            </button>
          </div>
        </label>

        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Rol
          <select
            className="rounded-xl border border-neutral-300 px-3 py-2 text-base"
            value={role}
            onChange={(e) => setRole(e.target.value as 'alumno' | 'admin')}
          >
            <option value="alumno">Alumno</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {role === 'alumno' && (
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Días de acceso
            <Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
          </label>
        )}

        <Button onClick={handleSubmit} disabled={!canSubmit || createUser.isPending}>
          {createUser.isPending ? 'Creando…' : 'Crear usuario'}
        </Button>
      </div>
    </Modal>
  );
}
