import { useState } from 'react';
import { Button, Input, Modal } from '../../../components/ui';
import { useInviteStudent } from '../hooks/useInviteStudent';
import { useToast } from '../../../lib/ToastProvider';

interface InviteStudentModalProps {
  open: boolean;
  onClose: () => void;
}

export function InviteStudentModal({ open, onClose }: InviteStudentModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [days, setDays] = useState('30');
  const invite = useInviteStudent();
  const { showToast } = useToast();

  function handleSubmit() {
    invite.mutate(
      { email, fullName, days: Number(days) },
      {
        onSuccess: () => {
          showToast(`Invitación enviada a ${email}`);
          onClose();
          setEmail('');
          setFullName('');
          setDays('30');
        },
        onError: (err) => showToast(err instanceof Error ? err.message : 'No pudimos invitar al alumno'),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-lg font-semibold">Nuevo alumno</p>
        <Input placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Días de acceso
          <Input type="number" min={1} value={days} onChange={(e) => setDays(e.target.value)} />
        </label>
        <Button onClick={handleSubmit} disabled={!email || !fullName || !days || invite.isPending}>
          {invite.isPending ? 'Invitando…' : 'Invitar'}
        </Button>
      </div>
    </Modal>
  );
}
