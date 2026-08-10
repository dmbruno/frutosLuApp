import { useState } from 'react';
import { Button, Input, Modal, Select } from '../../../components/ui';
import { useUpdateStudentProfile } from '../hooks/useUpdateStudentProfile';
import { useToast } from '../../../lib/ToastProvider';
import { SEX_OPTIONS, ATHLETE_PROFILE_OPTIONS, EXPERIENCE_OPTIONS } from '../../../lib/utils/profileLabels';
import type { Profile } from '../../../types/domain';

interface EditStudentModalProps {
  open: boolean;
  profile: Profile;
  onClose: () => void;
}

export function EditStudentModal({ open, profile, onClose }: EditStudentModalProps) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [sex, setSex] = useState(profile.sex ?? '');
  const [birthDate, setBirthDate] = useState(profile.birth_date ?? '');
  const [athleteProfile, setAthleteProfile] = useState(profile.athlete_profile ?? '');
  const [experienceLevel, setExperienceLevel] = useState(profile.experience_level ?? '');
  const [goal, setGoal] = useState(profile.goal ?? '');
  const [injuriesNotes, setInjuriesNotes] = useState(profile.injuries_notes ?? '');
  const update = useUpdateStudentProfile();
  const { showToast } = useToast();

  function handleSubmit() {
    update.mutate(
      {
        userId: profile.id,
        input: {
          full_name: fullName,
          sex: sex || null,
          birth_date: birthDate || null,
          athlete_profile: athleteProfile || null,
          experience_level: experienceLevel || null,
          goal: goal || null,
          injuries_notes: injuriesNotes || null,
        },
      },
      {
        onSuccess: () => {
          showToast('Datos actualizados');
          onClose();
        },
        onError: (err) => showToast(err instanceof Error ? err.message : 'No pudimos guardar los cambios'),
      },
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <p className="font-display text-lg font-extrabold text-neutral-900">Editar datos</p>

        <Input placeholder="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <div className="flex gap-2">
          <Select
            className="flex-1"
            options={SEX_OPTIONS}
            placeholder="Sexo"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
          />
          <Input
            type="date"
            className="flex-1"
            value={birthDate ?? ''}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        <Select
          options={ATHLETE_PROFILE_OPTIONS}
          placeholder="Perfil deportivo"
          value={athleteProfile}
          onChange={(e) => setAthleteProfile(e.target.value)}
        />

        <Select
          options={EXPERIENCE_OPTIONS}
          placeholder="Nivel"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        />

        <Input placeholder="Objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} />

        <textarea
          placeholder="Lesiones / consideraciones"
          value={injuriesNotes}
          onChange={(e) => setInjuriesNotes(e.target.value)}
          className="rounded-2xl border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
          rows={3}
        />

        <Button onClick={handleSubmit} disabled={!fullName || update.isPending}>
          {update.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </Modal>
  );
}
