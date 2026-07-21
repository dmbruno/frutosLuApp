import { useState } from 'react';
import { Input } from '../../../components/ui';
import { parseSetsReps } from '../../../lib/utils/parseSetsReps';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ProgramExerciseRowProps {
  programExercise: ProgramExerciseWithExercise;
  onChangeSetsReps: (text: string) => void;
  onRemove: () => void;
}

export function ProgramExerciseRow({ programExercise, onChangeSetsReps, onRemove }: ProgramExerciseRowProps) {
  const [text, setText] = useState(programExercise.sets_reps_text);
  const preview = parseSetsReps(text);

  function handleBlur() {
    if (text !== programExercise.sets_reps_text) {
      onChangeSetsReps(text);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-100 p-3">
      <div className="flex items-start gap-2">
        {programExercise.order_code && (
          <span className="mt-0.5 shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-500">
            {programExercise.order_code}
          </span>
        )}
        <p className="min-w-0 flex-1 text-sm font-medium">{programExercise.exercise.name}</p>
        <button onClick={onRemove} className="shrink-0 text-xs text-neutral-400">
          ✕
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input
          className="flex-1"
          placeholder="ej: 3X10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
        />
        <span className="shrink-0 whitespace-nowrap text-xs text-neutral-400">
          {preview.sets ?? '—'}x{preview.reps ?? '—'}
          {preview.isPerSide ? ' /lado' : ''}
        </span>
      </div>
    </div>
  );
}
