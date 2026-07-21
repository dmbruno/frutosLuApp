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
    <div className="flex items-center gap-2 border-b border-neutral-100 py-2 text-sm">
      <span className="w-8 shrink-0 font-mono text-xs text-neutral-400">{programExercise.order_code}</span>
      <span className="flex-1 truncate">{programExercise.exercise.name}</span>
      <Input className="w-28" value={text} onChange={(e) => setText(e.target.value)} onBlur={handleBlur} />
      <span className="w-20 shrink-0 text-xs text-neutral-400">
        {preview.sets ?? '—'}x{preview.reps ?? '—'}
        {preview.isPerSide ? ' /lado' : ''}
      </span>
      <button onClick={onRemove} className="shrink-0 text-xs text-neutral-400">
        ✕
      </button>
    </div>
  );
}
