import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card, Spinner } from '../../../components/ui';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { formatRelativeTime } from '../../../lib/utils/format';

export function AttentionAlerts() {
  const { data: sessions, isLoading } = useRecentActivity();

  if (isLoading) return <Spinner />;

  const flagged = (sessions ?? []).filter((s) => (s.feeling !== null && s.feeling <= 2) || s.athleteNote);
  if (flagged.length === 0) return null;

  return (
    <Card className="flex flex-col gap-1">
      <div className="mb-1 flex items-center gap-1.5">
        <AlertTriangle size={14} className="text-amber-500" />
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Necesitan tu atención</p>
      </div>
      <ul className="flex flex-col">
        {flagged.map((s) => (
          <li
            key={s.id}
            className="flex items-start justify-between gap-3 border-b border-neutral-100 py-2 text-sm last:border-0 last:pb-0"
          >
            <div className="min-w-0 flex-1">
              <Link to={`/admin/alumnos/${s.userId}`} className="font-semibold text-neutral-900 hover:opacity-70">
                {s.fullName}
              </Link>
              {s.athleteNote && <p className="truncate text-neutral-500">"{s.athleteNote}"</p>}
            </div>
            <div className="shrink-0 text-right text-xs text-neutral-400">
              {s.feeling !== null && s.feeling <= 2 && (
                <p className="font-medium text-amber-600">se sintió mal ({s.feeling}/5)</p>
              )}
              <p>{formatRelativeTime(s.finishedAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
