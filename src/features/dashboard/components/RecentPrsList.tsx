import { Link } from 'react-router-dom';
import { Card, Spinner } from '../../../components/ui';
import { useRecentPRs } from '../hooks/useRecentPRs';
import { formatRelativeTime } from '../../../lib/utils/format';

export function RecentPrsList() {
  const { data: prs, isLoading } = useRecentPRs();

  if (isLoading) return <Spinner />;
  if (!prs || prs.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">🏆 PRs de la semana</p>
      <ul className="flex flex-col">
        {prs.map((pr, i) => (
          <li
            key={`${pr.userId}-${pr.exerciseName}-${i}`}
            className="flex items-center justify-between gap-2 border-b border-neutral-100 py-2 text-sm last:border-0 last:pb-0"
          >
            <Link
              to={`/admin/alumnos/${pr.userId}`}
              className="min-w-0 flex-1 truncate text-neutral-700 transition-opacity hover:opacity-70"
            >
              <span className="font-medium">{pr.fullName}</span> · {pr.exerciseName}
            </Link>
            <span className="shrink-0 text-right text-xs text-neutral-500">
              {pr.weightKg}kg
              <br />
              <span className="text-neutral-400">{formatRelativeTime(pr.loggedAt)}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
