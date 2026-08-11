import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, ClipboardList } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/alumnos', label: 'Alumnos', icon: Users },
  { to: '/admin/ejercicios', label: 'Ejercicios', icon: Dumbbell },
  { to: '/admin/plantillas', label: 'Plantillas', icon: ClipboardList },
];

export function AdminBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-neutral-200 bg-white py-2 md:hidden">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
              isActive ? 'font-bold text-neutral-900' : 'font-medium text-neutral-400 hover:text-neutral-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
