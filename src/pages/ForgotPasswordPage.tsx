import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { AuthLayout } from '../components/layout/AuthLayout';
import { resetPasswordForEmail } from '../features/auth/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPasswordForEmail(email);
      setSent(true);
    } catch {
      setError('No pudimos enviar el mail. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Recuperar contraseña">
      {sent ? (
        <div className="text-center">
          <p className="font-semibold">Revisá tu email</p>
          <p className="text-sm text-neutral-500">Te enviamos un link para elegir una contraseña nueva.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
          <p className="text-center text-sm text-neutral-600">
            Ingresá tu email y te mandamos un link para restablecer tu contraseña.
          </p>
          <Input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar link'}
          </Button>
          <Link to="/login" className="text-center text-sm text-neutral-500 underline">
            Volver al login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
