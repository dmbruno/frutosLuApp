import { useState } from 'react';
import { LoginForm } from '../features/auth/components/LoginForm';
import { MagicLinkSent } from '../features/auth/components/MagicLinkSent';

export function LoginPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-[#FEE9E6] p-6 pt-20">
      <img src="/logos/AvatarFrutosLu-08.jpg" alt="Frutos Lu" className="h-48 w-48 rounded-full object-cover" />
      {sentTo ? <MagicLinkSent email={sentTo} /> : <LoginForm onSent={setSentTo} />}
    </div>
  );
}
