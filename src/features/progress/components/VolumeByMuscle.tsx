import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState, Spinner } from '../../../components/ui';

interface VolumeByMuscleProps {
  data: { muscle: string; volume_kg: number }[] | undefined;
  loading: boolean;
}

export function VolumeByMuscle({ data, loading }: VolumeByMuscleProps) {
  if (loading) return <Spinner />;
  const chartData = (data ?? []).filter((d) => d.volume_kg > 0).sort((a, b) => b.volume_kg - a.volume_kg);
  if (chartData.length === 0) {
    return <EmptyState title="Sin datos de volumen" description="Registrá series con peso para ver tu kilaje." />;
  }

  return (
    <div className="h-64 w-full rounded-2xl bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="muscle" width={100} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${Number(value).toFixed(0)} kg`} />
          <Bar dataKey="volume_kg" fill="#F2679C" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
