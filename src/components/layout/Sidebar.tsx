import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/alumnos', label: 'Alumnos' },
  { to: '/admin/ejercicios', label: 'Ejercicios' },
  { to: '/admin/plantillas', label: 'Plantillas' },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-white p-4 md:block">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-pink/10 text-brand-pink' : 'text-neutral-600'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
