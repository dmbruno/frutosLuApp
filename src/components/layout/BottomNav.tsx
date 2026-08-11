import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, BarChart3, User } from 'lucide-react';

const links = [
  { to: '/', label: 'Hoy', icon: Home },
  { to: '/semana', label: 'Semana', icon: CalendarDays },
  { to: '/progreso', label: 'Progreso', icon: BarChart3 },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-neutral-200 bg-white py-2">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              isActive ? 'font-bold text-neutral-900' : 'font-medium text-neutral-400 hover:text-neutral-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
