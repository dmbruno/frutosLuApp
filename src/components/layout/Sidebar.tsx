import { NavLink } from 'react-router-dom';
import { signOut } from '../../features/auth/api';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/alumnos', label: 'Alumnos' },
  { to: '/admin/ejercicios', label: 'Ejercicios' },
  { to: '/admin/plantillas', label: 'Plantillas' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 bg-white p-4 md:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-brand-pink/10 text-brand-pink' : 'text-neutral-600 hover:bg-neutral-100'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => signOut()}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </button>
    </aside>
  );
}
