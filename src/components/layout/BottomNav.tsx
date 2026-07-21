import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Hoy' },
  { to: '/semana', label: 'Semana' },
  { to: '/progreso', label: 'Progreso' },
  { to: '/perfil', label: 'Perfil' },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-neutral-200 bg-white py-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `px-3 py-1 text-sm font-medium ${isActive ? 'text-brand-pink' : 'text-neutral-400'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
