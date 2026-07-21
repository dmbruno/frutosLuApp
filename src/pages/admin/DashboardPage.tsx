import { useAdherence } from '../../features/students/hooks/useAdherence';
import { Spinner } from '../../components/ui';

export function DashboardPage() {
  const { data: students, summary, isLoading } = useAdherence();

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-green-500">{summary.verde}</p>
          <p className="text-xs text-neutral-500">al día</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-amber-500">{summary.amarillo}</p>
          <p className="text-xs text-neutral-500">atrasadas</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold text-red-500">{summary.rojo}</p>
          <p className="text-xs text-neutral-500">inactivas</p>
        </div>
      </div>
      <p className="text-sm text-neutral-500">{students?.length ?? 0} alumnas en total</p>
    </div>
  );
}
