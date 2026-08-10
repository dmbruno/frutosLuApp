import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, Select } from '../../../components/ui';
import { useStudents } from '../../students/hooks/useStudents';
import { useAssignTemplate } from '../hooks/useAssignTemplate';
import { useToast } from '../../../lib/ToastProvider';

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  templateId: string;
}

export function AssignModal({ open, onClose, templateId }: AssignModalProps) {
  const { data: students } = useStudents();
  const [studentId, setStudentId] = useState('');
  const [startsOn, setStartsOn] = useState('');
  const assignTemplate = useAssignTemplate();
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleAssign() {
    assignTemplate.mutate(
      { templateId, userId: studentId, startsOn },
      {
        onSuccess: () => {
          onClose();
          showToast('Plantilla asignada');
          navigate(`/admin/alumnos/${studentId}`);
        },
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-extrabold text-neutral-900">Asignar plantilla</p>
        <Select
          options={(students ?? []).map((student) => ({ value: student.user_id, label: student.full_name }))}
          placeholder="Elegí un alumno"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <Input type="date" value={startsOn} onChange={(e) => setStartsOn(e.target.value)} />
        <Button onClick={handleAssign} disabled={!studentId || !startsOn || assignTemplate.isPending}>
          {assignTemplate.isPending ? 'Asignando…' : 'Asignar'}
        </Button>
      </div>
    </Modal>
  );
}
