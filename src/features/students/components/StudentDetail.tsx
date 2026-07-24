import { useState } from 'react';
import { EmptyState, Spinner } from '../../../components/ui';
import { AdherenceLight } from './AdherenceLight';
import { SubscriptionToggle } from './SubscriptionToggle';
import { DaysRemainingBadge } from './DaysRemainingBadge';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';
import { SetPasswordModal } from './SetPasswordModal';
import { PrivateNote } from './PrivateNote';
import { ProgramEditor } from '../../programs/components/ProgramEditor';
import { MeasurementHistory } from '../../body-tracking/components/MeasurementHistory';
import { PhotoGrid } from '../../body-tracking/components/PhotoGrid';
import { useStudentDetail } from '../hooks/useStudentDetail';
import { useStudentPrograms } from '../../programs/hooks/useStudentPrograms';
import { useAdherence } from '../hooks/useAdherence';
import { useBodyMetrics } from '../../body-tracking/hooks/useBodyMetrics';
import { useProgressPhotos } from '../../body-tracking/hooks/useProgressPhotos';
import { daysRemaining } from '../../../lib/utils/dates';

interface StudentDetailProps {
  userId: string;
}

export function StudentDetail({ userId }: StudentDetailProps) {
  const { data: detail, isLoading: loadingDetail } = useStudentDetail(userId);
  const { data: programs, isLoading: loadingPrograms } = useStudentPrograms(userId);
  const { data: adherenceList } = useAdherence();
  const { measurements } = useBodyMetrics(userId);
  const { photos } = useProgressPhotos(userId);
  const [showRenew, setShowRenew] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);

  if (loadingDetail || loadingPrograms) return <Spinner />;
  if (!detail) return <EmptyState title="Alumno no encontrado" />;

  const { profile, recentSessions } = detail;
  const adherence = adherenceList?.find((a) => a.user_id === userId);
  const activeProgram = programs?.find((p) => p.is_active);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {adherence && <AdherenceLight trafficLight={adherence.traffic_light} />}
          <h1 className="truncate font-display text-xl font-semibold">{profile.full_name}</h1>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <DaysRemainingBadge days={daysRemaining(profile.subscription_expires_at)} />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRenew(true)}
              className="cursor-pointer text-xs text-brand-pink transition-opacity hover:opacity-70"
            >
              Renovar
            </button>
            <button
              onClick={() => setShowSetPassword(true)}
              className="cursor-pointer text-xs text-brand-pink transition-opacity hover:opacity-70"
            >
              Contraseña
            </button>
            <SubscriptionToggle userId={profile.id} status={profile.subscription_status} />
          </div>
        </div>
      </div>

      <PrivateNote userId={userId} />

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Anamnesis</p>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-neutral-400">Objetivo</dt>
            <dd>{profile.goal ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Nivel</dt>
            <dd>{profile.experience_level ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Perfil</dt>
            <dd>{profile.athlete_profile ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Lesiones</dt>
            <dd>{profile.injuries_notes ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Últimas sesiones</p>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-neutral-400">Sin sesiones registradas todavía.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex justify-between text-sm">
                <span>{new Date(s.started_at).toLocaleDateString('es-AR')}</span>
                <span className="text-neutral-400">{s.feeling ? `${s.feeling}/5` : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Medidas</p>
        <MeasurementHistory measurements={measurements} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Fotos de progreso</p>
        <PhotoGrid photos={photos} readOnly />
      </div>

      {activeProgram ? (
        <ProgramEditor programId={activeProgram.id} />
      ) : (
        <EmptyState title="Sin programa asignado" description="Asigná una plantilla desde /admin/plantillas." />
      )}

      <RenewSubscriptionModal
        open={showRenew}
        userId={profile.id}
        studentName={profile.full_name}
        onClose={() => setShowRenew(false)}
      />
      <SetPasswordModal
        open={showSetPassword}
        userId={profile.id}
        studentName={profile.full_name}
        onClose={() => setShowSetPassword(false)}
      />
    </div>
  );
}
