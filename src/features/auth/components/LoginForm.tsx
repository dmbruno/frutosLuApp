import { useState, type FormEvent } from 'react';
import { Button, Input } from '../../../components/ui';
import { signInWithOtp } from '../api';

interface LoginFormProps {
  onSent: (email: string) => void;
}

export function LoginForm({ onSent }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithOtp(email);
      onSent(email);
    } catch {
      setError('No pudimos enviar el link. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
      <Input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviarme el link'}
      </Button>
    </form>
  );
}
