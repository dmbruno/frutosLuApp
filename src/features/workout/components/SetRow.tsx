import { useState } from 'react';
import { useSetLogger } from '../hooks/useSetLogger';

interface SetRowProps {
  sessionId: string;
  programExerciseId: string;
  exerciseId: string;
  setNumber: number;
  lastWeightKg: number | null;
  lastReps: number | null;
  onLogged: () => void;
}

export function SetRow({
  sessionId,
  programExerciseId,
  exerciseId,
  setNumber,
  lastWeightKg,
  lastReps,
  onLogged,
}: SetRowProps) {
  const [weight, setWeight] = useState(lastWeightKg?.toString() ?? '');
  const [reps, setReps] = useState(lastReps?.toString() ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'queued'>('idle');
  const { submit } = useSetLogger();

  function step(delta: number) {
    setWeight((w) => Math.max(0, Number(w || 0) + delta).toString());
  }

  async function handleCheck() {
    setStatus('saving');
    const result = await submit({
      session_id: sessionId,
      program_exercise_id: programExerciseId,
      exercise_id: exerciseId,
      set_number: setNumber,
      set_type: 'normal',
      weight_kg: weight ? Number(weight) : null,
      reps: reps ? Number(reps) : null,
    });
    setStatus(result);
    onLogged();
  }

  const done = status === 'saved' || status === 'queued';

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="w-6 shrink-0 text-center text-sm font-semibold text-neutral-400">{setNumber}</span>
      <span className="w-20 shrink-0 text-xs text-neutral-400">
        {lastWeightKg != null && lastReps != null ? `${lastWeightKg}kg × ${lastReps}` : '—'}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => step(-2.5)}
          className="h-12 w-8 shrink-0 rounded-lg bg-neutral-100 text-sm text-neutral-500"
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          placeholder="kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="h-12 w-16 rounded-xl border border-neutral-300 text-center text-base"
        />
        <button
          type="button"
          onClick={() => step(2.5)}
          className="h-12 w-8 shrink-0 rounded-lg bg-neutral-100 text-sm text-neutral-500"
        >
          +
        </button>
      </div>
      <input
        type="number"
        inputMode="numeric"
        placeholder="reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        className="h-12 w-16 shrink-0 rounded-xl border border-neutral-300 text-center text-base"
      />
      <button
        onClick={handleCheck}
        disabled={status === 'saving'}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
          done ? 'bg-green-100 text-green-600' : 'bg-brand-pink text-white'
        }`}
      >
        {status === 'saving' ? '…' : '✓'}
      </button>
      {status === 'queued' && <span className="text-xs text-amber-500">guardado offline</span>}
    </div>
  );
}
