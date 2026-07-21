import { Button } from '../components/ui';
import { useAuth } from '../features/auth/hooks/useAuth';
import { signOut } from '../features/auth/api';
import { useBodyMetrics } from '../features/body-tracking/hooks/useBodyMetrics';
import { useProgressPhotos } from '../features/body-tracking/hooks/useProgressPhotos';
import { MeasurementsForm } from '../features/body-tracking/components/MeasurementsForm';
import { MeasurementHistory } from '../features/body-tracking/components/MeasurementHistory';
import { PhotoGrid } from '../features/body-tracking/components/PhotoGrid';

export function ProfilePage() {
  const { user } = useAuth();
  const { measurements, add } = useBodyMetrics(user?.id ?? '');
  const { photos, upload } = useProgressPhotos(user?.id ?? '');

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      <h1 className="font-display text-2xl font-semibold text-brand-pink">Mi perfil</h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">Medidas</h2>
        <MeasurementsForm
          onSubmit={(input) => user && add.mutate({ ...input, user_id: user.id })}
          submitting={add.isPending}
        />
        <MeasurementHistory measurements={measurements} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold">Fotos de progreso</h2>
        <PhotoGrid photos={photos} onUpload={(file, pose, stage) => upload.mutate({ file, pose, stage })} />
      </section>

      <Button onClick={() => signOut()} className="bg-neutral-200 text-neutral-700">
        Cerrar sesión
      </Button>
    </div>
  );
}
