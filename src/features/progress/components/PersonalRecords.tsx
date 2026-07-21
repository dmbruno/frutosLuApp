import { EmptyState, Spinner } from '../../../components/ui';
import { formatKg } from '../../../lib/utils/format';
import type { PersonalRecord } from '../api';

interface PersonalRecordsProps {
  records: PersonalRecord[] | undefined;
  loading: boolean;
}

export function PersonalRecords({ records, loading }: PersonalRecordsProps) {
  if (loading) return <Spinner />;
  if (!records || records.length === 0) {
    return <EmptyState title="Sin récords todavía" description="Registrá series con peso para ver tus PRs." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {records.slice(0, 10).map((r) => (
        <div key={r.exerciseId} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm">
          <p className="min-w-0 flex-1 truncate font-medium">{r.exerciseName}</p>
          <p className="shrink-0 text-sm text-neutral-500">{formatKg(r.maxWeightKg)} máx</p>
        </div>
      ))}
    </div>
  );
}
