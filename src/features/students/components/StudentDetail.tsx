import { useState } from 'react';
import { EmptyState, PendingChangesBar, Spinner } from '../../../components/ui';
import { PendingChangesProvider } from '../../../lib/PendingChangesContext';
import { AdherenceLight } from './AdherenceLight';
import { SubscriptionToggle } from './SubscriptionToggle';
import { DaysRemainingBadge } from './DaysRemainingBadge';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';
import { SetPasswordModal } from './SetPasswordModal';
import { EditStudentModal } from './EditStudentModal';
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
import { formatDate } from '../../../lib/utils/format';
import { SEX_OPTIONS, ATHLETE_PROFILE_OPTIONS, EXPERIENCE_OPTIONS, findLabel } from '../../../lib/utils/profileLabels';

const FEELING_EMOJI: Record<number, string> = { 1: '😫', 2: '😕', 3: '😐', 4: '🙂', 5: '💪' };

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
  const [showEdit, setShowEdit] = useState(false);

  if (loadingDetail || loadingPrograms) return <Spinner />;
  if (!detail) return <EmptyState title="Alumno no encontrado" />;

  const { profile, recentSessions } = detail;
  const adherence = adherenceList?.find((a) => a.user_id === userId);
  const activeProgram = programs?.find((p) => p.is_active);

  return (
    <PendingChangesProvider>
      <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          {adherence && <AdherenceLight trafficLight={adherence.traffic_light} />}
          <h1 className="min-w-0 flex-1 break-words font-display text-xl font-semibold">{profile.full_name}</h1>
          <DaysRemainingBadge days={daysRemaining(profile.subscription_expires_at)} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              onClick={() => setShowEdit(true)}
              className="cursor-pointer text-sm text-brand-pink transition-opacity hover:opacity-70"
            >
              Editar
            </button>
            <button
              onClick={() => setShowRenew(true)}
              className="cursor-pointer text-sm text-brand-pink transition-opacity hover:opacity-70"
            >
              Renovar
            </button>
            <button
              onClick={() => setShowSetPassword(true)}
              className="cursor-pointer text-sm text-brand-pink transition-opacity hover:opacity-70"
            >
              Contraseña
            </button>
          </div>
          <SubscriptionToggle userId={profile.id} status={profile.subscription_status} />
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
            <dd>{findLabel(EXPERIENCE_OPTIONS, profile.experience_level) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Perfil</dt>
            <dd>{findLabel(ATHLETE_PROFILE_OPTIONS, profile.athlete_profile) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Sexo</dt>
            <dd>{findLabel(SEX_OPTIONS, profile.sex) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Fecha de nacimiento</dt>
            <dd>{formatDate(profile.birth_date) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Lesiones</dt>
            <dd>{profile.injuries_notes ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase text-neutral-400">Últimas sesiones</p>
          <p className="text-xs text-neutral-400">Cómo se sintió</p>
        </div>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-neutral-400">Sin sesiones registradas todavía.</p>
        ) : (
          <div className="flex flex-col">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-2 border-b border-neutral-100 py-2 text-sm last:border-0 last:pb-0"
              >
                <span className="text-neutral-600">
                  {new Date(s.started_at).toLocaleDateString('es-AR')}{' '}
                  <span className="text-neutral-400">
                    {new Date(s.started_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
                <span className="text-lg">{s.feeling ? FEELING_EMOJI[s.feeling] : '—'}</span>
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
      <EditStudentModal open={showEdit} profile={profile} onClose={() => setShowEdit(false)} />

      <PendingChangesBar />
      </div>
    </PendingChangesProvider>
  );
}
