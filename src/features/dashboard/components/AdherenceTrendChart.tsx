import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState, Spinner } from '../../../components/ui';
import { useWeeklyAdherenceTrend } from '../hooks/useWeeklyAdherenceTrend';

function formatWeekLabel(weekStart: string): string {
  return new Date(`${weekStart}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export function AdherenceTrendChart() {
  const { data, isLoading } = useWeeklyAdherenceTrend();

  if (isLoading) return <Spinner />;
  const hasData = (data ?? []).some((d) => d.sessions > 0);
  if (!hasData) {
    return <EmptyState title="Sin sesiones en las últimas 8 semanas" />;
  }

  const chartData = (data ?? []).map((d) => ({ week: formatWeekLabel(d.weekStart), sesiones: d.sessions }));

  return (
    <div className="h-64 w-full rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Sesiones completadas por semana (todos los alumnos)
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#e5e5e5' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip formatter={(value) => [`${value} sesiones`, '']} labelFormatter={(label) => label} />
          <Bar dataKey="sesiones" fill="#F2679C" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
