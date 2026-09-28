import { useState, type ChangeEvent } from 'react';
import { CheckboxGroupWithOther, Input } from '../../../components/ui';
import { EXERCISE_BLOCKS, EQUIPMENT_OPTIONS } from '../../exercises/constants';
import { DAY_FORMATS, DAY_FORMAT_LABELS, INTERVAL_DURATION_PRESETS } from '../constants';
import { usePendingChanges } from '../../../lib/PendingChangesContext';
import { ProgramExerciseRow, type ProgramExerciseEdit } from './ProgramExerciseRow';
import type { DayWithExercises } from '../../../types/domain';
import type { ExerciseBlock, DayFormat } from '../../../types/database';

export interface ProgramDayEdit {
  format?: DayFormat;
  duration_min?: number | null;
  equipment_items?: string[];
  cover_image_url?: string | null;
}

interface DayBlockProps {
  day: DayWithExercises;
  onAddExercise: (block: ExerciseBlock) => void;
  onEditDay: (input: ProgramDayEdit) => Promise<void>;
  onEditExercise: (programExerciseId: string, input: ProgramExerciseEdit) => Promise<void>;
  onRemoveExercise: (programExerciseId: string, exerciseName: string) => void;
  // Ausente cuando el día vive fuera de un programa (biblioteca de
  // reemplazos): ahí "eliminar" ya está resuelto desde la lista, no hace
  // falta la acción acá adentro.
  onRemoveDay?: () => void;
  // Ausente en el editor de plantillas normal: la portada sólo aplica a la
  // biblioteca de reemplazos.
  onUploadCoverImage?: (file: File) => Promise<string>;
}

export function DayBlock({
  day,
  onAddExercise,
  onEditDay,
  onEditExercise,
  onRemoveExercise,
  onRemoveDay,
  onUploadCoverImage,
}: DayBlockProps) {
  const [format, setFormat] = useState<DayFormat>(day.format ?? 'tradicional');
  const [durationInput, setDurationInput] = useState(day.duration_min?.toString() ?? '');
  const [equipmentItems, setEquipmentItems] = useState<string[]>(day.equipment_items ?? []);
  const [coverImageUrl, setCoverImageUrl] = useState(day.cover_image_url ?? null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const pending = usePendingChanges();
  const isIntervalos = format === 'intervalos';

  // Los 3 campos del día (formato/duración/elementos) quedan en estado local
  // y sólo se confirman contra el servidor a través del sistema de "pending
  // changes": si hay un <PendingChangesProvider> arriba, esperan a que se
  // toque "Guardar cambios" (como ya hacen order_code/sets_reps_text/coach_note
  // en ProgramExerciseRow); si no hay provider, caen a guardado instantáneo.
  function commitFormat(next: DayFormat) {
    setFormat(next);
    if (next === (day.format ?? 'tradicional')) {
      pending?.clearPending(`${day.id}-format`);
      return;
    }
    if (pending) {
      pending.registerPending(`${day.id}-format`, () => onEditDay({ format: next }));
    } else {
      onEditDay({ format: next });
    }
  }

  function commitDuration(raw: string) {
    const value = raw ? Number(raw) : null;
    setDurationInput(raw);
    if (value === (day.duration_min ?? null)) {
      pending?.clearPending(`${day.id}-duration`);
      return;
    }
    if (pending) {
      pending.registerPending(`${day.id}-duration`, () => onEditDay({ duration_min: value }));
    } else {
      onEditDay({ duration_min: value });
    }
  }

  function commitEquipment(items: string[]) {
    setEquipmentItems(items);
    const savedItems = day.equipment_items ?? [];
    const unchanged = items.length === savedItems.length && items.every((i) => savedItems.includes(i));
    if (unchanged) {
      pending?.clearPending(`${day.id}-equipment`);
      return;
    }
    if (pending) {
      pending.registerPending(`${day.id}-equipment`, () => onEditDay({ equipment_items: items }));
    } else {
      onEditDay({ equipment_items: items });
    }
  }

  function commitCoverImage(url: string) {
    setCoverImageUrl(url);
    if (pending) {
      pending.registerPending(`${day.id}-cover`, () => onEditDay({ cover_image_url: url }));
    } else {
      onEditDay({ cover_image_url: url });
    }
  }

  async function handleCoverFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUploadCoverImage) return;
    setUploadingCover(true);
    try {
      commitCoverImage(await onUploadCoverImage(file));
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xl font-extrabold text-neutral-900">{day.title}</p>
        {onRemoveDay && (
          <button
            onClick={onRemoveDay}
            className="cursor-pointer text-xs text-neutral-400 transition-colors hover:text-red-400"
          >
            eliminar día
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
        <div className="flex gap-2">
          {DAY_FORMATS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => commitFormat(f)}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                format === f ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {DAY_FORMAT_LABELS[f]}
            </button>
          ))}
        </div>

        {onUploadCoverImage && (
          <div>
            <p className="mb-1 text-xs font-medium text-neutral-500">Portada</p>
            <div className="flex items-center gap-2">
              {coverImageUrl && (
                <img src={coverImageUrl} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
              )}
              <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-neutral-300 px-3 py-2.5 text-center text-sm text-neutral-500 transition-colors hover:border-brand-pink/50 hover:bg-white">
                {uploadingCover ? 'Subiendo…' : coverImageUrl ? 'Cambiar portada' : 'Subir portada'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCover}
                  onChange={handleCoverFile}
                />
              </label>
            </div>
          </div>
        )}

        {isIntervalos && (
          <>
            <div>
              <p className="mb-1 text-xs font-medium text-neutral-500">Duración (min)</p>
              <div className="flex items-center gap-2">
                {INTERVAL_DURATION_PRESETS.map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => commitDuration(String(min))}
                    className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      durationInput === String(min)
                        ? 'bg-brand-pink text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {min}'
                  </button>
                ))}
                <Input
                  type="number"
                  min={1}
                  placeholder="Otro"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  onBlur={(e) => commitDuration(e.target.value)}
                  className="w-20 py-1.5 text-sm"
                />
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium text-neutral-500">Elementos a utilizar</p>
              <CheckboxGroupWithOther options={EQUIPMENT_OPTIONS} value={equipmentItems} onChange={commitEquipment} />
            </div>
          </>
        )}
      </div>

      {isIntervalos ? (
        // Un circuito de intervalos es una lista ordenada, no un día armado
        // por bloques (movilidad/core/estructura...) — separarlo en 9
        // secciones acá sería puro ruido para algo que se hace de corrido.
        <div>
          <div className="mb-2 flex items-center justify-between border-b-2 border-neutral-200 pb-1.5">
            <p className="font-display text-base font-bold uppercase tracking-wide text-neutral-900">
              Ejercicios del circuito
            </p>
            <button
              onClick={() => onAddExercise('estructura')}
              className="cursor-pointer text-xs font-bold text-neutral-900 transition-opacity hover:opacity-70"
            >
              + agregar
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {[...day.exercises]
              .sort((a, b) => a.position - b.position)
              .map((pe, index) => (
                <ProgramExerciseRow
                  key={pe.id}
                  programExercise={pe}
                  fallbackOrderCode={String(index + 1)}
                  onEdit={(input) => onEditExercise(pe.id, input)}
                  onRemove={() => onRemoveExercise(pe.id, pe.exercise.name)}
                />
              ))}
          </div>
        </div>
      ) : (
        EXERCISE_BLOCKS.map((block) => {
          const exercisesInBlock = day.exercises.filter((e) => e.block === block);
          if (exercisesInBlock.length === 0 && block === 'otro') return null;
          return (
            <div key={block} className="mb-6 last:mb-0">
              <div className="mb-2 flex items-center justify-between border-b-2 border-neutral-200 pb-1.5">
                <p className="font-display text-base font-bold uppercase tracking-wide text-neutral-900">{block}</p>
                <button
                  onClick={() => onAddExercise(block)}
                  className="cursor-pointer text-xs font-bold text-neutral-900 transition-opacity hover:opacity-70"
                >
                  + agregar
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {exercisesInBlock.map((pe, index) => (
                  <ProgramExerciseRow
                    key={pe.id}
                    programExercise={pe}
                    fallbackOrderCode={String(index + 1)}
                    onEdit={(input) => onEditExercise(pe.id, input)}
                    onRemove={() => onRemoveExercise(pe.id, pe.exercise.name)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
