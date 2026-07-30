import { useState, type ChangeEvent } from 'react';
import { ConfirmDialog, EmptyState } from '../../../components/ui';
import type { ProgressPhotoWithUrl } from '../api';

interface PhotoGridProps {
  photos: ProgressPhotoWithUrl[] | undefined;
  onUpload?: (file: File, pose: string, stage: string) => void;
  onDelete?: (photo: ProgressPhotoWithUrl) => void;
  readOnly?: boolean;
}

const POSES = ['frente', 'atras', 'lateral_der', 'lateral_izq'];
const STAGES = ['inicio', 'final'];

export function PhotoGrid({ photos, onUpload, onDelete, readOnly }: PhotoGridProps) {
  const [pending, setPending] = useState<ProgressPhotoWithUrl | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>, pose: string, stage: string) {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file, pose, stage);
    e.target.value = '';
  }

  function handleConfirm() {
    if (pending && onDelete) onDelete(pending);
    setPending(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
              {photo.url && (
                <img
                  src={photo.url}
                  alt={`${photo.pose ?? ''} ${photo.stage ?? ''}`}
                  className="h-full w-full object-cover"
                />
              )}
              {!readOnly && onDelete && (
                <button
                  type="button"
                  aria-label="Eliminar foto"
                  onClick={() => setPending(photo)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-sm font-bold text-white transition-colors hover:bg-black/80"
                >
                  ×
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2">
            <EmptyState title="Sin fotos todavía" />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pending}
        title="¿Eliminar esta foto?"
        description="Se borra para siempre, no se puede deshacer."
        onConfirm={handleConfirm}
        onCancel={() => setPending(null)}
      />

      {!readOnly && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {STAGES.map((stage) =>
            POSES.map((pose) => (
              <label
                key={`${stage}-${pose}`}
                className="cursor-pointer rounded-xl border border-dashed border-neutral-300 p-2 text-center text-xs text-neutral-500 transition-colors hover:border-brand-pink/50 hover:bg-neutral-50"
              >
                {stage} · {pose}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, pose, stage)} />
              </label>
            )),
          )}
        </div>
      )}
    </div>
  );
}
