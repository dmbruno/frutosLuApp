import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, ClipboardList, LogOut } from 'lucide-react';
import { signOut } from '../../features/auth/api';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/alumnos', label: 'Alumnos', icon: Users },
  { to: '/admin/ejercicios', label: 'Ejercicios', icon: Dumbbell },
  { to: '/admin/plantillas', label: 'Plantillas', icon: ClipboardList },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 bg-white p-4 md:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-colors ${isActive ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={() => signOut()}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>
    </aside>
  );
}
