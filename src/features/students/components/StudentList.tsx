import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, ConfirmDialog, EmptyState, Spinner } from '../../../components/ui';
import { AdherenceLight } from './AdherenceLight';
import { SubscriptionToggle } from './SubscriptionToggle';
import { DaysRemainingBadge } from './DaysRemainingBadge';
import { RenewSubscriptionModal } from './RenewSubscriptionModal';
import { useDeleteStudent } from '../hooks/useDeleteStudent';
import { useToast } from '../../../lib/ToastProvider';
import { daysRemaining } from '../../../lib/utils/dates';
import type { Adherence } from '../../../types/domain';

interface StudentListProps {
  students: Adherence[] | undefined;
  loading: boolean;
  mode: 'active' | 'inactive';
}

export function StudentList({ students, loading, mode }: StudentListProps) {
  const [renewing, setRenewing] = useState<Adherence | null>(null);
  const [deleting, setDeleting] = useState<Adherence | null>(null);
  const deleteStudent = useDeleteStudent();
  const { showToast } = useToast();

  if (loading) return <Spinner />;
  if (!students || students.length === 0) {
    return (
      <EmptyState
        title={mode === 'inactive' ? 'Sin alumnos desactivados' : 'Sin alumnos'}
        description={mode === 'active' ? 'Agregalos con el botón de arriba.' : undefined}
      />
    );
  }

  async function handleConfirmDelete() {
    if (!deleting) return;
    try {
      await deleteStudent.mutateAsync(deleting.user_id);
      showToast(`"${deleting.full_name}" eliminado para siempre`);
      setDeleting(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No pudimos eliminar al alumno');
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {students.map((student) => (
        <Card key={student.user_id} className="flex items-center gap-3">
          <Link
            to={`/admin/alumnos/${student.user_id}`}
            className="flex min-w-0 flex-1 items-center gap-2 transition-opacity hover:opacity-70"
          >
            {mode === 'active' && <AdherenceLight trafficLight={student.traffic_light} />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{student.full_name}</p>
              {mode === 'active' && (
                <p className="text-xs text-neutral-500">{student.sessions_7d} sesiones esta semana</p>
              )}
            </div>
          </Link>

          {mode === 'active' ? (
            <div className="flex shrink-0 flex-col items-end gap-1">
              <DaysRemainingBadge days={daysRemaining(student.subscription_expires_at)} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRenewing(student)}
                  className="cursor-pointer text-xs text-brand-pink transition-opacity hover:opacity-70"
                >
                  Renovar
                </button>
                <SubscriptionToggle userId={student.user_id} status={student.subscription_status} />
              </div>
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-3 text-xs">
              <button
                onClick={() => setRenewing(student)}
                className="cursor-pointer font-medium text-brand-pink transition-opacity hover:opacity-70"
              >
                Activar
              </button>
              <button
                onClick={() => setDeleting(student)}
                className="cursor-pointer text-red-400 transition-opacity hover:opacity-70"
              >
                Eliminar
              </button>
            </div>
          )}
        </Card>
      ))}

      {renewing && (
        <RenewSubscriptionModal
          open={!!renewing}
          userId={renewing.user_id}
          studentName={renewing.full_name}
          onClose={() => setRenewing(null)}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        title={`¿Eliminar a ${deleting?.full_name} para siempre?`}
        description="Se borra su cuenta y TODO su historial (sesiones, medidas, fotos, notas, rutina asignada). No se puede deshacer."
        confirmLabel="Eliminar para siempre"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
