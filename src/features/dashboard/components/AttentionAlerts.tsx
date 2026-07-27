import { Link } from 'react-router-dom';
import { Card, Spinner } from '../../../components/ui';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { formatRelativeTime } from '../../../lib/utils/format';

export function AttentionAlerts() {
  const { data: sessions, isLoading } = useRecentActivity();

  if (isLoading) return <Spinner />;

  const flagged = (sessions ?? []).filter((s) => (s.feeling !== null && s.feeling <= 2) || s.athleteNote);
  if (flagged.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2 border border-amber-200 bg-amber-50">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Necesitan tu atención</p>
      <ul className="flex flex-col gap-2">
        {flagged.map((s) => (
          <li key={s.id} className="text-sm">
            <Link to={`/admin/alumnos/${s.userId}`} className="font-medium text-amber-900 hover:opacity-70">
              {s.fullName}
            </Link>
            <span className="text-amber-700"> · {formatRelativeTime(s.finishedAt)}</span>
            {s.feeling !== null && s.feeling <= 2 && (
              <span className="ml-1 text-amber-700">se sintió mal ({s.feeling}/5)</span>
            )}
            {s.athleteNote && <p className="mt-0.5 text-amber-800">"{s.athleteNote}"</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
