import { useState } from 'react';
import { Pencil, RotateCw, KeyRound } from 'lucide-react';
import { Avatar, EmptyState, PendingChangesBar, Spinner } from '../../../components/ui';
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

const ICON_BUTTON =
  'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900';

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
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar src={profile.avatar_url} fullName={profile.full_name} size="md" />
            {adherence && (
              <span className="absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-white">
                <AdherenceLight trafficLight={adherence.traffic_light} />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-extrabold text-neutral-900">{profile.full_name}</h1>
            <div className="mt-1">
              <DaysRemainingBadge days={daysRemaining(profile.subscription_expires_at)} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
          <div className="flex items-center gap-1">
            <button onClick={() => setShowEdit(true)} aria-label="Editar" className={ICON_BUTTON}>
              <Pencil size={16} />
            </button>
            <button onClick={() => setShowRenew(true)} aria-label="Renovar" className={ICON_BUTTON}>
              <RotateCw size={16} />
            </button>
            <button onClick={() => setShowSetPassword(true)} aria-label="Cambiar contraseña" className={ICON_BUTTON}>
              <KeyRound size={16} />
            </button>
          </div>
          <SubscriptionToggle userId={profile.id} status={profile.subscription_status} />
        </div>
      </div>

      <PrivateNote userId={userId} />

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Anamnesis</p>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-neutral-400">Objetivo</dt>
            <dd className="font-medium text-neutral-900">{profile.goal ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Nivel</dt>
            <dd className="font-medium text-neutral-900">{findLabel(EXPERIENCE_OPTIONS, profile.experience_level) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Perfil</dt>
            <dd className="font-medium text-neutral-900">{findLabel(ATHLETE_PROFILE_OPTIONS, profile.athlete_profile) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Sexo</dt>
            <dd className="font-medium text-neutral-900">{findLabel(SEX_OPTIONS, profile.sex) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Fecha de nacimiento</dt>
            <dd className="font-medium text-neutral-900">{formatDate(profile.birth_date) ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Lesiones</dt>
            <dd className="font-medium text-neutral-900">{profile.injuries_notes ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
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

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase text-neutral-400">Medidas</p>
        <MeasurementHistory measurements={measurements} />
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
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
