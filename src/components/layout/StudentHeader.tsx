import { useLocation } from 'react-router-dom';

function getTitle(pathname: string): string {
  if (pathname === '/') return 'Hoy';
  if (pathname.startsWith('/semana')) return 'Semana';
  if (pathname.startsWith('/progreso')) return 'Progreso';
  if (pathname.startsWith('/perfil')) return 'Perfil';
  return '';
}

export function StudentHeader() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);
  if (!title) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-28 flex-col justify-end bg-neutral-900 px-6 pb-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
      <h1 className="font-display text-2xl font-extrabold text-white">{title}</h1>
    </header>
  );
}
