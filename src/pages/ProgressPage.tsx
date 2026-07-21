import { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useMuscleVolume } from '../features/progress/hooks/useMuscleVolume';
import { useRecords } from '../features/progress/hooks/useRecords';
import { useStreak } from '../features/progress/hooks/useStreak';
import { VolumeByMuscle } from '../features/progress/components/VolumeByMuscle';
import { PersonalRecords } from '../features/progress/components/PersonalRecords';
import { StreakCard } from '../features/progress/components/StreakCard';
import { KPIs } from '../features/progress/components/KPIs';
import type { RangeKind } from '../features/progress/api';

const RANGES: { value: RangeKind; label: string }[] = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
];

export function ProgressPage() {
  const { user } = useAuth();
  const [range, setRange] = useState<RangeKind>('month');
  const { data: volume, isLoading: volumeLoading } = useMuscleVolume(user?.id, range);
  const { data: records, isLoading: recordsLoading } = useRecords();
  const { data: streak, isLoading: streakLoading } = useStreak();

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="font-display text-2xl font-semibold text-brand-pink">Progreso</h1>

      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              range === r.value ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KPIs muscleVolume={volume} />
        <StreakCard weeks={streak} loading={streakLoading} />
      </div>

      <VolumeByMuscle data={volume} loading={volumeLoading} />

      <h2 className="font-display text-lg font-semibold">Récords personales</h2>
      <PersonalRecords records={records} loading={recordsLoading} />
    </div>
  );
}
