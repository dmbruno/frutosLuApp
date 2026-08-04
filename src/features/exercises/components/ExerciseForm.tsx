import { useState, type ChangeEvent, type FormEvent, type PropsWithChildren, type ReactNode } from 'react';
import { Button, Input, Select, Toggle } from '../../../components/ui';
import { MUSCLE_GROUPS, EXERCISE_KINDS, EXERCISE_BLOCKS, EQUIPMENT_OPTIONS } from '../constants';
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

const KIND_LABELS: Record<string, string> = {
  fuerza: 'Fuerza',
  cardio: 'Cardio',
  movilidad: 'Movilidad',
};

const BLOCK_LABELS: Record<string, string> = {
  movilidad: 'Movilidad',
  core: 'Core',
  estructura: 'Estructura',
  cardio: 'Cardio',
  otro: 'Otro',
};

function Field({ label, children }: PropsWithChildren<{ label: ReactNode }>) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
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
  const [needsFilming, setNeedsFilming] = useState(initial?.needs_filming ?? false);
  const [equipment, setEquipment] = useState(initial?.equipment ?? '');

  // un dato viejo puede tener un equipo fuera de la lista vigente: lo dejamos seleccionable igual
  const equipmentOptions =
    equipment && !EQUIPMENT_OPTIONS.includes(equipment as (typeof EQUIPMENT_OPTIONS)[number])
      ? [equipment, ...EQUIPMENT_OPTIONS]
      : EQUIPMENT_OPTIONS;

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

  function toggleSecondaryMuscle(muscle: string) {
    setSecondaryMuscles((prev) => (prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]));
  }

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nombre del ejercicio">
        <Input
          placeholder="Ej: SENTADILLA SUMO CON BARRA"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <div className="flex gap-3">
        <Field label="Tipo">
          <Select
            options={EXERCISE_KINDS.map((k) => ({ value: k, label: KIND_LABELS[k] ?? k }))}
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
          />
        </Field>
        <Field label="Bloque">
          <Select
            options={EXERCISE_BLOCKS.map((b) => ({ value: b, label: BLOCK_LABELS[b] ?? b }))}
            value={defaultBlock}
            onChange={(e) => setDefaultBlock(e.target.value as typeof defaultBlock)}
          />
        </Field>
      </div>

      <Field label="Músculo principal">
        <Select
          options={MUSCLE_GROUPS.map((m) => ({ value: m, label: m }))}
          value={primaryMuscle}
          onChange={(e) => setPrimaryMuscle(e.target.value as typeof primaryMuscle)}
        />
      </Field>

      <Field label="Músculos secundarios">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-neutral-300 p-3 sm:grid-cols-3">
          {MUSCLE_GROUPS.map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 cursor-pointer accent-brand-pink"
                checked={secondaryMuscles.includes(m)}
                onChange={() => toggleSecondaryMuscle(m)}
              />
              {m}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Instrucciones">
        <textarea
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base focus:border-brand-pink focus:outline-none"
          placeholder="Indicaciones para la alumna (opcional)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Field>

      <Field label="URL de video">
        <Input placeholder="YouTube, Instagram..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      </Field>

      <Field label="Imagen (miniatura)">
        <div className="flex items-center gap-2">
          <Input
            placeholder="URL de imagen"
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
      </Field>

      <Field label="Equipamiento">
        <Select
          placeholder="Sin especificar"
          options={equipmentOptions.map((eq) => ({ value: eq, label: eq }))}
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
        />
      </Field>

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
