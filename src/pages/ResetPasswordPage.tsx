import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PasswordInput } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import { updatePassword } from '../features/auth/api';
import { useToast } from '../lib/ToastProvider';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updatePassword(password);
      showToast('Contraseña actualizada');
      navigate('/');
    } catch {
      setError('No pudimos actualizar la contraseña. Pedí un nuevo link desde "Olvidé mi contraseña".');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Nueva contraseña">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
        <p className="text-center text-sm text-neutral-600">Elegí tu nueva contraseña.</p>
        <PasswordInput
          required
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : 'Guardar contraseña'}
        </Button>
      </form>
    </AuthLayout>
  );
}
