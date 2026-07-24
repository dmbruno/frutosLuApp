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
        className="cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
