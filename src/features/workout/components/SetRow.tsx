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
    <div className="grid grid-cols-[28px_1fr_132px_56px_48px] items-center gap-2 py-2">
      <span className="text-center text-sm font-semibold">{setNumber}</span>
      <span className="truncate text-xs text-neutral-400">
        {lastWeightKg != null && lastReps != null ? `${lastWeightKg}kg × ${lastReps}` : 'Sin registro'}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => step(-2.5)}
          className="h-12 w-8 shrink-0 cursor-pointer rounded-lg bg-neutral-100 text-sm text-neutral-500 transition-colors hover:bg-neutral-200"
        >
          −
        </button>
        <input
          type="number"
          inputMode="decimal"
          placeholder="kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="h-12 w-14 shrink-0 rounded-xl border border-neutral-300 text-center text-base"
        />
        <button
          type="button"
          onClick={() => step(2.5)}
          className="h-12 w-8 shrink-0 cursor-pointer rounded-lg bg-neutral-100 text-sm text-neutral-500 transition-colors hover:bg-neutral-200"
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
        className="h-12 w-14 shrink-0 rounded-xl border border-neutral-300 text-center text-base"
      />
      <button
        onClick={handleCheck}
        disabled={status === 'saving'}
        className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl text-xl transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 ${
          done ? 'bg-green-100 text-green-600' : 'bg-brand-pink text-white'
        }`}
      >
        {status === 'saving' ? '…' : '✓'}
      </button>
      {status === 'queued' && <span className="col-span-5 text-xs text-amber-500">guardado offline</span>}
    </div>
  );
}
