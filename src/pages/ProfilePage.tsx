import { Button } from '../components/ui';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useRole } from '../features/auth/hooks/useRole';
import { signOut } from '../features/auth/api';
import { useBodyMetrics } from '../features/body-tracking/hooks/useBodyMetrics';
import { useProgressPhotos } from '../features/body-tracking/hooks/useProgressPhotos';
import { MeasurementsForm } from '../features/body-tracking/components/MeasurementsForm';
import { MeasurementHistory } from '../features/body-tracking/components/MeasurementHistory';
import { PhotoGrid } from '../features/body-tracking/components/PhotoGrid';
import { useToast } from '../lib/ToastProvider';
import { formatDate } from '../lib/utils/format';
import { SEX_OPTIONS, ATHLETE_PROFILE_OPTIONS, EXPERIENCE_OPTIONS, findLabel } from '../lib/utils/profileLabels';

export function ProfilePage() {
  const { user } = useAuth();
  const { profile } = useRole();
  const { measurements, add } = useBodyMetrics(user?.id ?? '');
  const { photos, upload, remove } = useProgressPhotos(user?.id ?? '');
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="font-display text-2xl font-semibold text-brand-pink">Mi perfil</h1>

      {profile && (
        <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Datos personales</h2>
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-400">Nombre</dt>
              <dd className="text-right text-neutral-700">{profile.full_name}</dd>
            </div>
            {user?.email && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Email</dt>
                <dd className="text-right text-neutral-700">{user.email}</dd>
              </div>
            )}
            {profile.birth_date && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Fecha de nacimiento</dt>
                <dd className="text-right text-neutral-700">{formatDate(profile.birth_date)}</dd>
              </div>
            )}
            {profile.sex && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Sexo</dt>
                <dd className="text-right text-neutral-700">{findLabel(SEX_OPTIONS, profile.sex)}</dd>
              </div>
            )}
            {profile.athlete_profile && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Perfil deportivo</dt>
                <dd className="text-right text-neutral-700">
                  {findLabel(ATHLETE_PROFILE_OPTIONS, profile.athlete_profile)}
                </dd>
              </div>
            )}
            {profile.experience_level && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Nivel</dt>
                <dd className="text-right text-neutral-700">
                  {findLabel(EXPERIENCE_OPTIONS, profile.experience_level)}
                </dd>
              </div>
            )}
            {profile.goal && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Objetivo</dt>
                <dd className="text-right text-neutral-700">{profile.goal}</dd>
              </div>
            )}
            {profile.injuries_notes && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-400">Lesiones/consideraciones</dt>
                <dd className="text-right text-neutral-700">{profile.injuries_notes}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-semibold">Medidas</h2>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <MeasurementsForm
            onSubmit={(input) =>
              user && add.mutate({ ...input, user_id: user.id }, { onSuccess: () => showToast('Medidas guardadas') })
            }
            submitting={add.isPending}
          />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <MeasurementHistory measurements={measurements} />
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">Fotos de progreso</h2>
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
    </div>
  );
}
