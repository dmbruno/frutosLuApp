import type { ChangeEvent } from 'react';
import { EmptyState } from '../../../components/ui';
import type { ProgressPhotoWithUrl } from '../api';

interface PhotoGridProps {
  photos: ProgressPhotoWithUrl[] | undefined;
  onUpload?: (file: File, pose: string, stage: string) => void;
  readOnly?: boolean;
}

const POSES = ['frente', 'atras', 'lateral_der', 'lateral_izq'];
const STAGES = ['inicio', 'final'];

export function PhotoGrid({ photos, onUpload, readOnly }: PhotoGridProps) {
  function handleFile(e: ChangeEvent<HTMLInputElement>, pose: string, stage: string) {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file, pose, stage);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="aspect-square overflow-hidden rounded-xl bg-neutral-100">
              {photo.url && (
                <img
                  src={photo.url}
                  alt={`${photo.pose ?? ''} ${photo.stage ?? ''}`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2">
            <EmptyState title="Sin fotos todavía" />
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {STAGES.map((stage) =>
            POSES.map((pose) => (
              <label
                key={`${stage}-${pose}`}
                className="rounded-xl border border-dashed border-neutral-300 p-2 text-center text-xs text-neutral-500"
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
