import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { signOut } from '../../features/auth/api';
import { useAdminHeaderActionValue } from '../../lib/AdminHeaderContext';

function getTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname.startsWith('/admin/alumnos')) return 'Alumnos';
  if (pathname.startsWith('/admin/ejercicios')) return 'Ejercicios';
  if (pathname.startsWith('/admin/plantillas')) return 'Plantillas';
  return 'Admin';
}

export function AdminHeader() {
  const { pathname } = useLocation();
  const action = useAdminHeaderActionValue();
  const isDashboard = pathname === '/admin';

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-28 flex-col justify-end bg-neutral-900 px-6 pb-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)] md:hidden">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-white">{getTitle(pathname)}</h1>
        {isDashboard ? (
          <button
            onClick={() => signOut()}
            aria-label="Cerrar sesión"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          >
            <LogOut size={22} />
          </button>
        ) : (
          action
        )}
      </div>
    </header>
  );
}
