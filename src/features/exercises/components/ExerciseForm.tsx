import { useState, type ChangeEvent, type FormEvent } from 'react';
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
  onUploadThumbnail: (file: File) => Promise<string>;
}

export function ExerciseForm({ initial, onSubmit, onCancel, submitting, onUploadThumbnail }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [kind, setKind] = useState(initial?.kind ?? 'fuerza');
  const [defaultBlock, setDefaultBlock] = useState(initial?.default_block ?? 'estructura');
  const [primaryMuscle, setPrimaryMuscle] = useState(initial?.primary_muscle ?? 'cuerpo_completo');
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>(initial?.secondary_muscles ?? []);
  const [instructions, setInstructions] = useState(initial?.instructions ?? '');
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initial?.thumbnail_url ?? '');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  async function handleThumbnailFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingThumbnail(true);
    try {
      setThumbnailUrl(await onUploadThumbnail(file));
    } finally {
      setUploadingThumbnail(false);
    }
  }
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
      thumbnail_url: thumbnailUrl || null,
      needs_filming: needsFilming,
      equipment: equipment || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input placeholder="Nombre del ejercicio" required value={name} onChange={(e) => setName(e.target.value)} />

      <div className="flex gap-2">
        <select
          className="flex-1 cursor-pointer rounded-xl border border-neutral-300 px-3 py-2"
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
          className="flex-1 cursor-pointer rounded-xl border border-neutral-300 px-3 py-2"
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
        className="cursor-pointer rounded-xl border border-neutral-300 px-3 py-2"
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
          className="h-32 w-full cursor-pointer rounded-xl border border-neutral-300 px-3 py-2"
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

      <div className="flex items-center gap-2">
        <Input
          placeholder="URL de imagen (miniatura)"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="flex-1"
        />
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt="Miniatura" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
        )}
        <label className="shrink-0 cursor-pointer rounded-xl border border-dashed border-neutral-300 px-3 py-3 text-sm text-neutral-500 transition-colors hover:border-brand-pink/50 hover:bg-neutral-50">
          {uploadingThumbnail ? 'Subiendo…' : 'Subir'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploadingThumbnail}
            onChange={handleThumbnailFile}
          />
        </label>
      </div>
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
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
