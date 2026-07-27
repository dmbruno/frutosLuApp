import { Link } from 'react-router-dom';
import { Card, Spinner } from '../../../components/ui';
import type { Adherence } from '../../../types/domain';

interface TrafficLightBreakdownProps {
  students: Adherence[] | undefined;
  loading: boolean;
}

const GROUPS: { key: Adherence['traffic_light']; label: string; dot: string; text: string }[] = [
  { key: 'verde', label: 'Al día', dot: 'bg-green-500', text: 'text-green-600' },
  { key: 'amarillo', label: 'Atrasados', dot: 'bg-amber-400', text: 'text-amber-600' },
  { key: 'rojo', label: 'Inactivos', dot: 'bg-red-500', text: 'text-red-600' },
];

const MAX_NAMES = 4;

export function TrafficLightBreakdown({ students, loading }: TrafficLightBreakdownProps) {
  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {GROUPS.map((group) => {
        const inGroup = (students ?? []).filter((s) => s.traffic_light === group.key);
        const shown = inGroup.slice(0, MAX_NAMES);
        const rest = inGroup.length - shown.length;

        return (
          <Card key={group.key} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${group.dot}`} />
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{group.label}</span>
              </div>
              <span className={`font-display text-2xl font-semibold ${group.text}`}>{inGroup.length}</span>
            </div>
            {shown.length === 0 ? (
              <p className="text-xs text-neutral-400">Nadie en esta categoría.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {shown.map((s) => (
                  <li key={s.user_id} className="truncate">
                    <Link
                      to={`/admin/alumnos/${s.user_id}`}
                      className="text-sm text-neutral-600 transition-opacity hover:opacity-70"
                    >
                      {s.full_name}
                    </Link>
                  </li>
                ))}
                {rest > 0 && (
                  <li>
                    <Link to="/admin/alumnos" className="text-xs text-neutral-400 hover:text-neutral-600">
                      +{rest} más
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}
