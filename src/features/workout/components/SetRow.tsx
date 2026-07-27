import { useState } from 'react';
import { useSetLogger } from '../hooks/useSetLogger';

interface SetRowProps {
  sessionId: string;
  programExerciseId: string;
  exerciseId: string;
  setNumber: number;
  label: string;
  unit: string | null;
  lastWeightKg: number | null;
  lastReps: number | null;
  onLogged: () => void;
}

export function SetRow({
  sessionId,
  programExerciseId,
  exerciseId,
  setNumber,
  label,
  unit,
  lastWeightKg,
  lastReps,
  onLogged,
}: SetRowProps) {
  const [weight, setWeight] = useState(lastWeightKg?.toString() ?? '');
  const [reps, setReps] = useState(lastReps?.toString() ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'queued'>('idle');
  const { submit } = useSetLogger();

  const isTimed = unit === 'seg' || unit === 'min';

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
      weight_kg: isTimed ? null : weight ? Number(weight) : null,
      reps: isTimed ? null : reps ? Number(reps) : null,
    });
    setStatus(result);
    onLogged();
  }

  const done = status === 'saved' || status === 'queued';

  const checkButton = (
    <button
      onClick={handleCheck}
      disabled={status === 'saving'}
      className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl text-xl transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 ${
        done ? 'bg-green-100 text-green-600' : 'bg-brand-pink text-white'
      }`}
    >
      {status === 'saving' ? '…' : '✓'}
    </button>
  );

  if (isTimed) {
    return (
      <div className="flex flex-col gap-1 border-b border-neutral-100 py-3 last:border-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">{label}</span>
          {checkButton}
        </div>
        {status === 'queued' && <span className="text-xs text-amber-500">guardado offline</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-b border-neutral-100 py-3 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-neutral-400">
          {lastWeightKg != null && lastReps != null
            ? `Última vez: ${lastWeightKg}kg × ${lastReps}`
            : 'Sin registro anterior'}
        </span>
      </div>

      <div className="flex items-end justify-center gap-2">
        <button
          type="button"
          onClick={() => step(-2.5)}
          className="h-12 w-9 shrink-0 cursor-pointer rounded-lg bg-neutral-100 text-base text-neutral-500 transition-colors hover:bg-neutral-200"
        >
          −
        </button>
        <label className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Kg</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-12 w-16 rounded-xl border border-neutral-300 text-center text-base"
          />
        </label>
        <button
          type="button"
          onClick={() => step(2.5)}
          className="h-12 w-9 shrink-0 cursor-pointer rounded-lg bg-neutral-100 text-base text-neutral-500 transition-colors hover:bg-neutral-200"
        >
          +
        </button>

        <label className="ml-2 flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Reps</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="h-12 w-16 rounded-xl border border-neutral-300 text-center text-base"
          />
        </label>

        <div className="ml-2">{checkButton}</div>
      </div>

      {status === 'queued' && <span className="text-center text-xs text-amber-500">guardado offline</span>}
    </div>
  );
}
