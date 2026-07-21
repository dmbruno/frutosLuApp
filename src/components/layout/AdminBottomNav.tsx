import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/alumnos', label: 'Alumnos' },
  { to: '/admin/ejercicios', label: 'Ejercicios' },
  { to: '/admin/plantillas', label: 'Plantillas' },
];

export function AdminBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-neutral-200 bg-white py-2 md:hidden">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/admin'}
          className={({ isActive }) =>
            `px-2 py-1 text-xs font-medium ${isActive ? 'text-brand-pink' : 'text-neutral-400'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
