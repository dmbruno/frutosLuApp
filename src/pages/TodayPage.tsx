import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type ConnectionStatus = 'checking' | 'ok' | 'error';

export function TodayPage() {
  const [status, setStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-brand-pink">Frutos Lu</h1>
      <p className="text-neutral-600">
        {status === 'checking' && 'Conectando con Supabase…'}
        {status === 'ok' && '✅ Supabase conectado'}
        {status === 'error' && '❌ No se pudo conectar a Supabase'}
      </p>
      <p className="text-xs text-neutral-400">{import.meta.env.VITE_SUPABASE_URL}</p>
    </div>
  );
}
