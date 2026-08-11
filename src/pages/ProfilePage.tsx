import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useRole } from '../features/auth/hooks/useRole';
import { signOut } from '../features/auth/api';
import { useBodyMetrics } from '../features/body-tracking/hooks/useBodyMetrics';
import { useProgressPhotos } from '../features/body-tracking/hooks/useProgressPhotos';
import { MeasurementsForm } from '../features/body-tracking/components/MeasurementsForm';
import { MeasurementHistory } from '../features/body-tracking/components/MeasurementHistory';
import { PhotoGrid } from '../features/body-tracking/components/PhotoGrid';
import { AvatarUpload } from '../features/profile/components/AvatarUpload';
import { EditProfileModal } from '../features/profile/components/EditProfileModal';
import { useUploadAvatar } from '../features/profile/hooks/useUploadAvatar';
import { useToast } from '../lib/ToastProvider';
import { formatDate } from '../lib/utils/format';
import { SEX_OPTIONS, ATHLETE_PROFILE_OPTIONS, EXPERIENCE_OPTIONS, findLabel } from '../lib/utils/profileLabels';

export function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useRole();
  const { measurements, add } = useBodyMetrics(user?.id ?? '');
  const { photos, upload, remove } = useProgressPhotos(user?.id ?? '');
  const uploadAvatar = useUploadAvatar();
  const [showEdit, setShowEdit] = useState(false);
  const { showToast } = useToast();

  function handleAvatarUpload(file: File) {
    if (!user) return;
    uploadAvatar.mutate(
      { userId: user.id, file },
      {
        onSuccess: () => showToast('Foto de perfil actualizada'),
        onError: (err) => showToast(err instanceof Error ? err.message : 'No pudimos subir la foto'),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {profile && (
        <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <AvatarUpload
              avatarUrl={profile.avatar_url}
              fullName={profile.full_name}
              onUpload={handleAvatarUpload}
              uploading={uploadAvatar.isPending}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-extrabold text-neutral-900">{profile.full_name}</p>
              {user?.email && <p className="truncate text-sm text-neutral-500">{user.email}</p>}
            </div>
            <button
              onClick={() => setShowEdit(true)}
              aria-label="Editar mis datos"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Pencil size={16} />
            </button>
          </div>

          <dl className="flex flex-col gap-1.5 border-t border-neutral-100 pt-3 text-sm">
            {profile.birth_date && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Fecha de nacimiento</dt>
                <dd className="text-right font-medium text-neutral-900">{formatDate(profile.birth_date)}</dd>
              </div>
            )}
            {profile.sex && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Sexo</dt>
                <dd className="text-right font-medium text-neutral-900">{findLabel(SEX_OPTIONS, profile.sex)}</dd>
              </div>
            )}
            {profile.athlete_profile && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Perfil deportivo</dt>
                <dd className="text-right font-medium text-neutral-900">
                  {findLabel(ATHLETE_PROFILE_OPTIONS, profile.athlete_profile)}
                </dd>
              </div>
            )}
            {profile.experience_level && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Nivel</dt>
                <dd className="text-right font-medium text-neutral-900">
                  {findLabel(EXPERIENCE_OPTIONS, profile.experience_level)}
                </dd>
              </div>
            )}
            {profile.goal && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Objetivo</dt>
                <dd className="text-right font-medium text-neutral-900">{profile.goal}</dd>
              </div>
            )}
            {profile.injuries_notes && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Lesiones/consideraciones</dt>
                <dd className="text-right font-medium text-neutral-900">{profile.injuries_notes}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-extrabold text-neutral-900">Medidas</h2>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <MeasurementsForm
            onSubmit={(input) =>
              user && add.mutate({ ...input, user_id: user.id }, { onSuccess: () => showToast('Medidas guardadas') })
            }
            submitting={add.isPending}
          />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <MeasurementHistory measurements={measurements} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-extrabold text-neutral-900">Fotos de progreso</h2>
        <PhotoGrid
          photos={photos}
          onUpload={(file, pose, stage) =>
            upload.mutate({ file, pose, stage }, { onSuccess: () => showToast('Foto subida') })
          }
          onDelete={(photo) =>
            remove.mutate(
              { photoId: photo.id, storagePath: photo.storage_path },
              { onSuccess: () => showToast('Foto eliminada') },
            )
          }
        />
      </section>

      <Button onClick={() => signOut()}>Cerrar sesión</Button>

      {profile && <EditProfileModal open={showEdit} profile={profile} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
