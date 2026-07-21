import { useState, type FormEvent } from 'react';
import { Button, Input, Toggle } from '../../../components/ui';
import { MUSCLE_GROUPS, EXERCISE_KINDS, EXERCISE_BLOCKS } from '../constants';
import type { Exercise } from '../../../types/domain';
import type { Database } from '../../../types/database';

type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];

interface ExerciseFormProps {
  initial?: Exercise;
  onSubmit: (input: ExerciseInsert) => void;
  onCancel: () => void;
  submitting?: boolean;
}

export function ExerciseForm({ initial, onSubmit, onCancel, submitting }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [kind, setKind] = useState(initial?.kind ?? 'fuerza');
  const [defaultBlock, setDefaultBlock] = useState(initial?.default_block ?? 'estructura');
  const [primaryMuscle, setPrimaryMuscle] = useState(initial?.primary_muscle ?? 'cuerpo_completo');
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>(initial?.secondary_muscles ?? []);
  const [instructions, setInstructions] = useState(initial?.instructions ?? '');
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? '');
  const [needsFilming, setNeedsFilming] = useState(initial?.needs_filming ?? false);
  const [equipment, setEquipment] = useState(initial?.equipment ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      kind,
      default_block: defaultBlock,
      primary_muscle: primaryMuscle,
      secondary_muscles: secondaryMuscles as Exercise['secondary_muscles'],
      instructions: instructions || null,
      video_url: videoUrl || null,
      needs_filming: needsFilming,
      equipment: equipment || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input placeholder="Nombre del ejercicio" required value={name} onChange={(e) => setName(e.target.value)} />

      <div className="flex gap-2">
        <select
          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2"
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
        >
          {EXERCISE_KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select
          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2"
          value={defaultBlock}
          onChange={(e) => setDefaultBlock(e.target.value as typeof defaultBlock)}
        >
          {EXERCISE_BLOCKS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <select
        className="rounded-xl border border-neutral-300 px-3 py-2"
        value={primaryMuscle}
        onChange={(e) => setPrimaryMuscle(e.target.value as typeof primaryMuscle)}
      >
        {MUSCLE_GROUPS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <div>
        <p className="mb-1 text-sm text-neutral-500">Músculos secundarios</p>
        <select
          multiple
          className="h-32 w-full rounded-xl border border-neutral-300 px-3 py-2"
          value={secondaryMuscles}
          onChange={(e) => setSecondaryMuscles(Array.from(e.target.selectedOptions, (o) => o.value))}
        >
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="rounded-xl border border-neutral-300 px-3 py-2"
        placeholder="Instrucciones"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <Input placeholder="URL de video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      <Input
        placeholder="Equipamiento (BW, DDB, DKB, barra...)"
        value={equipment}
        onChange={(e) => setEquipment(e.target.value)}
      />

      <Toggle checked={needsFilming} onChange={setNeedsFilming} label="Falta filmar" />

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button type="button" onClick={onCancel} className="flex-1 bg-neutral-200 text-neutral-700">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
