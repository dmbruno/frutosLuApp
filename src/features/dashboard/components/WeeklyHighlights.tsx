import { Link } from 'react-router-dom';
import { Card, Spinner } from '../../../components/ui';
import { useWeeklyHighlights } from '../hooks/useWeeklyHighlights';
import type { StudentHighlight } from '../api';

function HighlightList({ title, emoji, items }: { title: string; emoji: string; items: StudentHighlight[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex-1">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {emoji} {title}
      </p>
      <ul className="flex flex-col gap-1">
        {items.map((s) => (
          <li key={s.id} className="truncate text-sm">
            <Link to={`/admin/alumnos/${s.id}`} className="text-neutral-700 transition-opacity hover:opacity-70">
              {s.fullName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WeeklyHighlights() {
  const { data, isLoading } = useWeeklyHighlights();

  if (isLoading) return <Spinner />;
  if (!data || (data.birthdays.length === 0 && data.newStudents.length === 0)) return null;

  return (
    <Card className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      <HighlightList title="Cumpleaños esta semana" emoji="🎂" items={data.birthdays} />
      <HighlightList title="Nuevas esta semana" emoji="✨" items={data.newStudents} />
    </Card>
  );
}
