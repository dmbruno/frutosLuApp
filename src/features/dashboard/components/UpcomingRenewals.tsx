import { Link } from 'react-router-dom';
import { Card, Spinner } from '../../../components/ui';
import { daysRemaining } from '../../../lib/utils/dates';
import type { Adherence } from '../../../types/domain';

interface UpcomingRenewalsProps {
  students: Adherence[] | undefined;
  loading: boolean;
}

export function UpcomingRenewals({ students, loading }: UpcomingRenewalsProps) {
  if (loading) return <Spinner />;

  const upcoming = (students ?? [])
    .filter((s) => s.subscription_status === 'active')
    .map((s) => ({ student: s, days: daysRemaining(s.subscription_expires_at) }))
    .filter((s): s is { student: Adherence; days: number } => s.days !== null && s.days <= 7)
    .sort((a, b) => a.days - b.days);

  if (upcoming.length === 0) return null;

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Vencen pronto</p>
      <ul className="flex flex-col">
        {upcoming.map(({ student, days }) => (
          <li
            key={student.user_id}
            className="flex items-center justify-between gap-2 border-b border-neutral-100 py-2 text-sm last:border-0 last:pb-0"
          >
            <Link
              to={`/admin/alumnos/${student.user_id}`}
              className="min-w-0 flex-1 truncate text-neutral-700 transition-opacity hover:opacity-70"
            >
              {student.full_name}
            </Link>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                days <= 0 ? 'bg-red-100 text-red-600' : days <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {days <= 0 ? 'Vencido' : `${days} días`}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
