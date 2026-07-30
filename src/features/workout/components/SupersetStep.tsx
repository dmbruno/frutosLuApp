import { useRef } from 'react';
import { useQueries } from '@tanstack/react-query';
import { getLastPerformances } from '../api';
import { buildSetSlots, type SetSlot } from '../buildSetSlots';
import { ExerciseHeader } from './ExerciseHeader';
import { SetRow } from './SetRow';
import type { ProgramExerciseWithExercise } from '../../../types/domain';

interface SupersetStepProps {
  exercises: ProgramExerciseWithExercise[];
  sessionId: string;
  onSetLogged: (restSec: number | null) => void;
}

interface RoundEntry {
  exercise: ProgramExerciseWithExercise;
  slot: SetSlot;
}

export function SupersetStep({ exercises, sessionId, onSetLogged }: SupersetStepProps) {
  // Coordina cuándo se completó la ronda entera (todos los ejercicios del
  // grupo en esa ronda), no si visualmente se re-renderiza: es puro estado
  // de coordinación, por eso va en un ref y no en useState.
  const completedByRound = useRef<Record<number, Set<string>>>({});

  const lastPerformanceQueries = useQueries({
    queries: exercises.map((exercise) => ({
      queryKey: ['last-performance', exercise.id],
      queryFn: () => getLastPerformances(exercise.id),
    })),
  });

  const slotsByExercise = exercises.map((exercise) => buildSetSlots(exercise));
  const maxRounds = Math.max(...slotsByExercise.map((slots) => slots.length));

  const rounds: RoundEntry[][] = Array.from({ length: maxRounds }, (_, roundIndex) =>
    exercises
      .map((exercise, i) => ({ exercise, slot: slotsByExercise[i][roundIndex] }))
      .filter((entry): entry is RoundEntry => entry.slot !== undefined),
  );

  function handleSetLogged(roundIndex: number, exerciseId: string, roundEntries: RoundEntry[]) {
    const done = completedByRound.current[roundIndex] ?? new Set<string>();
    done.add(exerciseId);
    completedByRound.current[roundIndex] = done;

    const roundExerciseIds = roundEntries.map((entry) => entry.exercise.id);
    if (roundExerciseIds.every((id) => done.has(id))) {
      const lastEntry = roundEntries[roundEntries.length - 1];
      onSetLogged(lastEntry.exercise.rest_sec);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="rounded-2xl bg-white p-4 shadow-sm">
          <ExerciseHeader exercise={exercise} />
        </div>
      ))}

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        {rounds.map((roundEntries, roundIndex) => (
          <div key={roundIndex} className="mb-4 last:mb-0">
            <p className="mb-1 text-xs font-semibold uppercase text-neutral-400">Ronda {roundIndex + 1}</p>
            <div className="flex flex-col">
              {roundEntries.map(({ exercise, slot }) => {
                const exerciseIndex = exercises.indexOf(exercise);
                const lastPerformances = lastPerformanceQueries[exerciseIndex]?.data;
                return (
                  <SetRow
                    key={exercise.id}
                    sessionId={sessionId}
                    programExerciseId={exercise.id}
                    exerciseId={exercise.exercise_id}
                    setNumber={slot.setNumber}
                    label={`${exercise.exercise.name} · ${slot.label}`}
                    unit={exercise.rep_unit}
                    trackWeight={exercise.exercise.kind !== 'movilidad'}
                    parsedReps={exercise.parsed_reps}
                    lastWeightKg={lastPerformances?.[slot.setNumber]?.weight_kg ?? null}
                    lastReps={lastPerformances?.[slot.setNumber]?.reps ?? null}
                    onLogged={() => handleSetLogged(roundIndex, exercise.id, roundEntries)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
