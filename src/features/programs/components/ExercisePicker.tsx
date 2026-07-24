import { useState } from 'react';
import { Input, Modal } from '../../../components/ui';
import { useExercises } from '../../exercises/hooks/useExercises';
import type { Exercise } from '../../../types/domain';

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (exercise: Exercise) => void;
}

export function ExercisePicker({ open, onClose, onPick }: ExercisePickerProps) {
  const [search, setSearch] = useState('');
  const { data: exercises } = useExercises(search);

  return (
    <Modal open={open} onClose={onClose}>
      <Input placeholder="Buscar ejercicio…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="mt-3 max-h-80 overflow-y-auto">
        {(exercises ?? []).map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => {
              onPick(exercise);
              onClose();
            }}
            className="block w-full cursor-pointer border-b border-neutral-100 py-2 text-left text-sm transition-colors hover:bg-neutral-50"
          >
            {exercise.name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
