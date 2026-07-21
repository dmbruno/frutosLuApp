import { Button } from '../components/ui';
import { signOut } from '../features/auth/api';

export function BlockedPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center">
      <h1 className="font-display text-xl font-semibold text-brand-pink">Acceso pausado</h1>
      <p className="text-neutral-600">Contactá a tu profe para renovar tu suscripción.</p>
      <Button onClick={() => signOut()}>Cerrar sesión</Button>
    </div>
  );
}
