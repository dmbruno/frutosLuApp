import { useEffect, useState } from 'react';
import { Input } from '../../../components/ui';
import { parseSetsReps } from '../../../lib/utils/parseSetsReps';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

export interface ProgramExerciseEdit {
  sets_reps_text?: string;
  order_code?: string;
  coach_note?: string;
}

interface ProgramExerciseRowProps {
  programExercise: ProgramExerciseWithExercise;
  fallbackOrderCode: string;
  onEdit: (input: ProgramExerciseEdit) => void;
  onRemove: () => void;
}

export function ProgramExerciseRow({ programExercise, fallbackOrderCode, onEdit, onRemove }: ProgramExerciseRowProps) {
  const { exercise } = programExercise;
  const [text, setText] = useState(programExercise.sets_reps_text);
  const [orderCode, setOrderCode] = useState(programExercise.order_code || fallbackOrderCode);
  const [coachNote, setCoachNote] = useState(programExercise.coach_note ?? '');
  const preview = parseSetsReps(text);

  // Ejercicios agregados antes de que existiera la numeración automática se
  // guardaron con order_code vacío: se auto-completan la primera vez que se ven.
  useEffect(() => {
    if (!programExercise.order_code) {
      onEdit({ order_code: fallbackOrderCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-neutral-200 p-3">
      <div className="flex items-start gap-2">
        <input
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          onBlur={() => {
            if (orderCode !== (programExercise.order_code ?? '')) onEdit({ order_code: orderCode });
          }}
          className="mt-0.5 w-10 shrink-0 rounded bg-neutral-100 px-1 py-1 text-center font-mono text-xs text-neutral-500"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{exercise.name}</p>
          {(exercise.equipment || exercise.video_url) && (
            <div className="mt-1 flex flex-wrap gap-1">
              {exercise.equipment && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                  {exercise.equipment}
                </span>
              )}
              {exercise.video_url && (
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-brand-pink/10 px-2 py-0.5 text-[11px] font-medium text-brand-pink"
                >
                  🎥 Video
                </a>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 cursor-pointer text-xs text-neutral-400 transition-colors hover:text-red-400"
        >
          ✕
        </button>
      </div>

      {exercise.instructions && (
        <p className="mt-2 whitespace-pre-line rounded-lg bg-neutral-50 p-2 text-xs text-neutral-600">
          {exercise.instructions}
        </p>
      )}

      <div className="mt-2 flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="ej: 3X10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            if (text !== programExercise.sets_reps_text) onEdit({ sets_reps_text: text });
          }}
        />
        <span className="shrink-0 whitespace-nowrap text-xs text-neutral-400">
          {preview.sets ?? '—'}x{preview.reps ?? '—'}
          {preview.isPerSide ? ' /lado' : ''}
        </span>
      </div>

      <input
        value={coachNote}
        onChange={(e) => setCoachNote(e.target.value)}
        onBlur={() => {
          if (coachNote !== (programExercise.coach_note ?? '')) onEdit({ coach_note: coachNote });
        }}
        placeholder="Nota de coach (opcional, ej: rodillas flexionadas)"
        className="mt-2 w-full rounded-lg border border-neutral-200 px-2 py-1 text-xs text-neutral-600 placeholder:text-neutral-300"
      />
    </div>
  );
}
