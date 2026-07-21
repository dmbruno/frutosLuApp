import { useState } from 'react';
import { Button, ConfirmDialog, EmptyState, Input, Spinner } from '../../../components/ui';
import { WeekTabs } from './WeekTabs';
import { DayBlock } from './DayBlock';
import { ExercisePicker } from './ExercisePicker';
import { useProgramEditor } from '../hooks/useProgramEditor';
import { useToast } from '../../../lib/ToastProvider';
import type { Exercise } from '../../../types/domain';
import type { ExerciseBlock } from '../../../types/database';

interface ProgramEditorProps {
  programId: string;
}

type PendingRemoval = { type: 'day' | 'exercise'; id: string; label: string };

export function ProgramEditor({ programId }: ProgramEditorProps) {
  const { program, loading, error, addDay, removeDay, addExercise, editExercise, removeExercise, editProgram } =
    useProgramEditor(programId);
  const { showToast } = useToast();

  const [activeWeek, setActiveWeek] = useState(1);
  const [pickerTarget, setPickerTarget] = useState<{ dayId: string; block: ExerciseBlock } | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);

  if (loading) return <Spinner />;
  if (error || !program) return <EmptyState title="No pudimos cargar la plantilla" />;

  const weekNumbers = [...new Set(program.days.map((d) => d.week_number))].sort((a, b) => a - b);
  if (weekNumbers.length === 0) weekNumbers.push(1);
  const daysOfWeek = program.days.filter((d) => d.week_number === activeWeek);

  function handleAddDay() {
    addDay.mutate(
      {
        program_id: programId,
        week_number: activeWeek,
        title: `DIA ${daysOfWeek.length + 1}`,
        position: daysOfWeek.length + 1,
      },
      { onSuccess: () => showToast('Día agregado') },
    );
  }

  function handleAddWeek() {
    setActiveWeek(weekNumbers.length > 0 ? Math.max(...weekNumbers) + 1 : 1);
  }

  function handleDuplicatePrevious() {
    const previousDays = program!.days.filter((d) => d.week_number === activeWeek - 1);
    previousDays.forEach((day) => {
      addDay.mutate(
        { program_id: programId, week_number: activeWeek, title: day.title, position: day.position },
        {
          onSuccess: (newDay) => {
            day.exercises.forEach((pe) => {
              addExercise.mutate({
                program_day_id: newDay.id,
                exercise_id: pe.exercise_id,
                block: pe.block,
                order_code: pe.order_code,
                position: pe.position,
                sets_reps_text: pe.sets_reps_text,
                superset_group: pe.superset_group,
                rest_sec: pe.rest_sec,
                coach_note: pe.coach_note,
              });
            });
          },
        },
      );
    });
    showToast('Semana duplicada');
  }

  function handlePickExercise(exercise: Exercise) {
    if (!pickerTarget) return;
    const day = program!.days.find((d) => d.id === pickerTarget.dayId);
    addExercise.mutate(
      {
        program_day_id: pickerTarget.dayId,
        exercise_id: exercise.id,
        block: pickerTarget.block,
        position: (day?.exercises.length ?? 0) + 1,
        sets_reps_text: '3X10',
      },
      { onSuccess: () => showToast('Ejercicio agregado') },
    );
  }

  async function handleConfirmRemoval() {
    if (!pendingRemoval) return;
    if (pendingRemoval.type === 'day') {
      await removeDay.mutateAsync(pendingRemoval.id);
      showToast('Día eliminado');
    } else {
      await removeExercise.mutateAsync(pendingRemoval.id);
      showToast('Ejercicio eliminado');
    }
    setPendingRemoval(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-xl font-semibold">{program.name}</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Semanas reales al asignar
          <Input
            type="number"
            min={1}
            className="w-24"
            defaultValue={program.total_weeks ?? 1}
            onBlur={(e) =>
              editProgram.mutate(
                { total_weeks: Number(e.target.value) },
                { onSuccess: () => showToast('Configuración guardada') },
              )
            }
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Patrón de ciclo (semanas tipo, ej: 1,2,1,2)
          <Input
            className="w-40"
            defaultValue={program.cycle_pattern?.join(',') ?? ''}
            onBlur={(e) =>
              editProgram.mutate(
                {
                  cycle_pattern: e.target.value
                    .split(',')
                    .map((n) => parseInt(n.trim(), 10))
                    .filter((n) => !isNaN(n)),
                },
                { onSuccess: () => showToast('Configuración guardada') },
              )
            }
          />
        </label>
      </div>

      <WeekTabs
        weekNumbers={weekNumbers}
        activeWeek={activeWeek}
        onSelect={setActiveWeek}
        onAddWeek={handleAddWeek}
        onDuplicatePrevious={handleDuplicatePrevious}
      />

      <div className="flex flex-col gap-3">
        {daysOfWeek.map((day) => (
          <DayBlock
            key={day.id}
            day={day}
            onAddExercise={(block) => setPickerTarget({ dayId: day.id, block })}
            onEditExercise={(id, text) => editExercise.mutate({ id, input: { sets_reps_text: text } })}
            onRemoveExercise={(id, name) => setPendingRemoval({ type: 'exercise', id, label: name })}
            onRemoveDay={() => setPendingRemoval({ type: 'day', id: day.id, label: day.title })}
          />
        ))}
        <Button onClick={handleAddDay} className="bg-neutral-200 text-neutral-700">
          + Agregar día
        </Button>
      </div>

      <ExercisePicker open={!!pickerTarget} onClose={() => setPickerTarget(null)} onPick={handlePickExercise} />

      <ConfirmDialog
        open={!!pendingRemoval}
        title={pendingRemoval?.type === 'day' ? '¿Eliminar este día?' : '¿Eliminar este ejercicio?'}
        description={
          pendingRemoval
            ? pendingRemoval.type === 'day'
              ? `"${pendingRemoval.label}" y todos sus ejercicios se van a borrar.`
              : `"${pendingRemoval.label}" se va a quitar de este día.`
            : undefined
        }
        onConfirm={handleConfirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
