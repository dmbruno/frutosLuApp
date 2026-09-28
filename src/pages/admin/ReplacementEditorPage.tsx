import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmDialog, EmptyState, PendingChangesBar, Spinner } from '../../components/ui';
import { PendingChangesProvider } from '../../lib/PendingChangesContext';
import { DayBlock } from '../../features/programs/components/DayBlock';
import { ExercisePicker } from '../../features/programs/components/ExercisePicker';
import { useReplacementDayEditor } from '../../features/programs/hooks/useReplacementDayEditor';
import type { Exercise } from '../../types/domain';
import type { ExerciseBlock } from '../../types/database';

export function ReplacementEditorPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const { day, loading, error, editDay, addExercise, editExercise, removeExercise, uploadCoverImage } =
    useReplacementDayEditor(dayId ?? '');
  const [pickerBlock, setPickerBlock] = useState<ExerciseBlock | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<{ id: string; label: string } | null>(null);

  if (loading) return <Spinner />;
  if (error || !day) return <EmptyState title="No pudimos cargar la rutina" />;

  function handlePickExercise(exercise: Exercise) {
    if (!pickerBlock || !day) return;
    addExercise.mutate({
      program_day_id: day.id,
      exercise_id: exercise.id,
      block: pickerBlock,
      order_code: String(day.exercises.length + 1),
      position: day.exercises.length + 1,
      sets_reps_text: '3X10',
    });
  }

  async function handleConfirmRemoval() {
    if (!pendingRemoval) return;
    await removeExercise.mutateAsync(pendingRemoval.id);
    setPendingRemoval(null);
  }

  return (
    <PendingChangesProvider>
      <div className="flex flex-col gap-4">
        <DayBlock
          day={day}
          onAddExercise={(block) => setPickerBlock(block)}
          onEditDay={(input) => editDay.mutateAsync(input).then(() => {})}
          onEditExercise={(id, input) => editExercise.mutateAsync({ id, input }).then(() => {})}
          onRemoveExercise={(id, name) => setPendingRemoval({ id, label: name })}
          onUploadCoverImage={(file) => uploadCoverImage.mutateAsync(file)}
        />

        <ExercisePicker open={!!pickerBlock} onClose={() => setPickerBlock(null)} onPick={handlePickExercise} />

        <ConfirmDialog
          open={!!pendingRemoval}
          title="¿Eliminar este ejercicio?"
          description={pendingRemoval ? `"${pendingRemoval.label}" se va a quitar de esta rutina.` : undefined}
          onConfirm={handleConfirmRemoval}
          onCancel={() => setPendingRemoval(null)}
        />

        <PendingChangesBar />
      </div>
    </PendingChangesProvider>
  );
}
