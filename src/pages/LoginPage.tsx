import { useState } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm';
import { MagicLinkSent } from '../features/auth/components/MagicLinkSent';

export function LoginPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-neutral-50 p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-pink">Frutos Lu</h1>
      {sentTo ? <MagicLinkSent email={sentTo} /> : <LoginForm onSent={setSentTo} />}
    </div>
  );
}
