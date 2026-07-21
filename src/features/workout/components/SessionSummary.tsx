import { useState } from 'react';
import { Button, Spinner } from '../../../components/ui';
import { useSessionSummary } from '../hooks/useSessionSummary';
import { formatKg } from '../../../lib/utils/format';

const FEELINGS = [
  { value: 1, emoji: '😫' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '💪' },
];

interface SessionSummaryProps {
  sessionId: string;
  startedAt: string;
  onFinish: (feeling: number, note: string | null) => void;
}

export function SessionSummary({ sessionId, startedAt, onFinish }: SessionSummaryProps) {
  const { data: summary, isLoading } = useSessionSummary(sessionId, startedAt);
  const [feeling, setFeeling] = useState<number | null>(null);
  const [note, setNote] = useState('');

  if (isLoading || !summary) return <Spinner />;

  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <h2 className="font-display text-xl font-semibold">¡Listo!</h2>
      <div className="flex gap-6 text-sm text-neutral-500">
        <div>
          <p className="font-display text-2xl font-semibold text-brand-pink">{summary.durationMin}'</p>
          <p>duración</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-brand-pink">{formatKg(summary.totalVolumeKg)}</p>
          <p>kilaje</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-brand-pink">{summary.totalSets}</p>
          <p>series</p>
        </div>
      </div>

      <p className="font-medium">¿Cómo te sentiste?</p>
      <div className="flex gap-3">
        {FEELINGS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFeeling(f.value)}
            className={`text-3xl transition ${feeling === f.value ? 'scale-125' : 'opacity-40'}`}
          >
            {f.emoji}
          </button>
        ))}
      </div>
      <textarea
        placeholder="Nota para tu profe (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full max-w-sm rounded-xl border border-neutral-300 p-3"
      />
      <Button disabled={!feeling} onClick={() => feeling && onFinish(feeling, note || null)} className="w-full max-w-sm">
        Terminar
      </Button>
    </div>
  );
}
