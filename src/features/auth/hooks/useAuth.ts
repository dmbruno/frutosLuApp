import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSession, onAuthStateChange } from '../api';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
  }, []);

  return { session, user: session?.user ?? null, loading };
}
