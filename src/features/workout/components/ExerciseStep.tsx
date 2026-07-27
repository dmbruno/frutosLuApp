import { useLastPerformance } from '../hooks/useLastPerformance';
import { SetRow } from './SetRow';
import { VideoEmbed } from '../../../components/ui';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface ExerciseStepProps {
  exercise: ProgramExerciseWithExercise;
  sessionId: string;
  onSetLogged: (restSec: number | null) => void;
}

interface SetSlot {
  setNumber: number;
  label: string;
}

// "3X10" → 3 filas ("Serie 1/2/3"). "3X1' POR LADO" → 6 filas, alternando lado
// dentro de cada ronda ("Serie 1 · Derecho", "Serie 1 · Izquierdo", "Serie 2 ·
// Derecho"...), porque cada lado es una ejecución completa aparte.
function buildSetSlots(exercise: ProgramExerciseWithExercise): SetSlot[] {
  const numSets = exercise.parsed_sets ?? 3;
  if (!exercise.is_per_side) {
    return Array.from({ length: numSets }, (_, i) => ({ setNumber: i + 1, label: `Serie ${i + 1}` }));
  }
  const slots: SetSlot[] = [];
  for (let round = 1; round <= numSets; round++) {
    slots.push({ setNumber: slots.length + 1, label: `Serie ${round} · Derecho` });
    slots.push({ setNumber: slots.length + 1, label: `Serie ${round} · Izquierdo` });
  }
  return slots;
}

export function ExerciseStep({ exercise, sessionId, onSetLogged }: ExerciseStepProps) {
  const { data: lastPerformances } = useLastPerformance(exercise.id);
  const slots = buildSetSlots(exercise);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-neutral-400">{exercise.order_code}</p>
      <h3 className="font-display text-lg font-semibold">{exercise.exercise.name}</h3>
      <p className="text-sm text-neutral-500">{exercise.sets_reps_text}</p>
      {exercise.exercise.instructions && (
        <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{exercise.exercise.instructions}</p>
      )}
      {exercise.coach_note && (
        <p className="mt-1 rounded-lg bg-brand-amber/10 p-2 text-sm text-brand-amber">{exercise.coach_note}</p>
      )}
      {exercise.exercise.video_url && (
        <VideoEmbed url={exercise.exercise.video_url} title={exercise.exercise.name} />
      )}
      <div className="mt-3">
        <div className="flex flex-col">
          {slots.map((slot) => (
            <SetRow
              key={slot.setNumber}
              sessionId={sessionId}
              programExerciseId={exercise.id}
              exerciseId={exercise.exercise_id}
              setNumber={slot.setNumber}
              label={slot.label}
              unit={exercise.rep_unit}
              lastWeightKg={lastPerformances?.[slot.setNumber]?.weight_kg ?? null}
              lastReps={lastPerformances?.[slot.setNumber]?.reps ?? null}
              onLogged={() => onSetLogged(exercise.rest_sec)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
