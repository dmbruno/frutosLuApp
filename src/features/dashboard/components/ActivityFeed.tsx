import { Link } from 'react-router-dom';
import { Card, EmptyState, Spinner } from '../../../components/ui';
import { useRecentActivity } from '../hooks/useRecentActivity';
import { formatRelativeTime } from '../../../lib/utils/format';

const FEELING_EMOJI: Record<number, string> = { 1: '😫', 2: '😕', 3: '😐', 4: '🙂', 5: '💪' };

export function ActivityFeed() {
  const { data: sessions, isLoading } = useRecentActivity();

  if (isLoading) return <Spinner />;
  if (!sessions || sessions.length === 0) {
    return <EmptyState title="Sin actividad esta semana" description="Todavía nadie entrenó en los últimos 7 días." />;
  }

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Actividad reciente</p>
      <ul className="flex flex-col">
        {sessions.slice(0, 10).map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-2 border-b border-neutral-100 py-2 text-sm last:border-0 last:pb-0"
          >
            <Link
              to={`/admin/alumnos/${s.userId}`}
              className="min-w-0 flex-1 truncate text-neutral-700 transition-opacity hover:opacity-70"
            >
              {s.fullName} <span className="text-neutral-400">· {formatRelativeTime(s.finishedAt)}</span>
            </Link>
            <span className="shrink-0 text-lg">{s.feeling ? FEELING_EMOJI[s.feeling] : '—'}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
