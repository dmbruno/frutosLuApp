import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { EmptyState } from '../../../components/ui';
import { CIRCUMFERENCE_FIELDS } from '../../../lib/utils/bodyMetrics';
import { formatDate } from '../../../lib/utils/format';
import type { BodyMetric } from '../../../types/domain';

interface BeforeAfterRadarProps {
  inicio: BodyMetric | undefined;
  final: BodyMetric | undefined;
}

export function BeforeAfterRadar({ inicio, final }: BeforeAfterRadarProps) {
  const data = CIRCUMFERENCE_FIELDS.map((f) => ({
    subject: f.label,
    Inicio: inicio?.[f.key] ?? null,
    Final: final?.[f.key] ?? null,
  })).filter((d) => d.Inicio != null && d.Final != null);

  if (!inicio || !final || data.length < 3) {
    return (
      <EmptyState
        title="Sin comparación disponible"
        description="Cargá medidas con etiqueta Inicio y Final (mínimo 3 circunferencias en común) para ver el antes y después."
      />
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-center text-xs text-neutral-400">
        Comparando Inicio ({formatDate(inicio.measured_on)}) → Final ({formatDate(final.measured_on)})
      </p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }} outerRadius="65%">
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Radar name="Inicio" dataKey="Inicio" stroke="#FF6F59" fill="#FF6F59" fillOpacity={0.25} />
            <Radar name="Final" dataKey="Final" stroke="#171717" fill="#171717" fillOpacity={0.15} />
            <Tooltip formatter={(value) => `${Number(value)} cm`} />
            <Legend wrapperStyle={{ paddingTop: 24 }} itemSorter={null} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
