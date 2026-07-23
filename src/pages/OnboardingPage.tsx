import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useRole } from '../features/auth/hooks/useRole';
import { OnboardingWizard } from '../features/onboarding/components/OnboardingWizard';
import { Spinner } from '../components/ui';

export function OnboardingPage() {
  const { user } = useAuth();
  const { profile, loading } = useRole();
  const navigate = useNavigate();

  if (loading || !user) return <Spinner />;

  return (
    <OnboardingWizard
      userId={user.id}
      initialFullName={profile?.full_name ?? ''}
      onDone={() => navigate('/')}
    />
  );
}
