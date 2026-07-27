import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState, Spinner } from '../../../components/ui';
import { useProfileDistribution } from '../hooks/useProfileDistribution';
import { ATHLETE_PROFILE_OPTIONS, findLabel } from '../../../lib/utils/profileLabels';

// Orden categórico fijo (nunca ciclado) — mismos 4 slots validados del tema
// por defecto de la skill de dataviz (blue/orange/aqua/yellow), + gris para
// "sin definir" que no es una categoría real sino un residual.
const COLORS: Record<string, string> = {
  runner: '#2a78d6',
  rugby: '#eb6834',
  postparto: '#1baf7a',
  libre: '#eda100',
  sin_definir: '#a3a3a3',
};

export function ProfileDistributionChart() {
  const { data, isLoading } = useProfileDistribution();

  if (isLoading) return <Spinner />;
  if (!data || data.length === 0) {
    return <EmptyState title="Sin datos de perfil deportivo" />;
  }

  const order = [...ATHLETE_PROFILE_OPTIONS.map((o) => o.value), 'sin_definir'];
  const chartData = [...data]
    .sort((a, b) => order.indexOf(a.profile) - order.indexOf(b.profile))
    .map((d) => ({
      profile: d.profile === 'sin_definir' ? 'Sin definir' : (findLabel(ATHLETE_PROFILE_OPTIONS, d.profile) ?? d.profile),
      count: d.count,
      color: COLORS[d.profile] ?? '#a3a3a3',
    }));

  return (
    <div className="h-64 w-full rounded-2xl bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Distribución por perfil deportivo
      </p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <XAxis type="number" allowDecimals={false} hide />
          <YAxis type="category" dataKey="profile" width={110} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} alumnos`, '']} />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((d) => (
              <Cell key={d.profile} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
