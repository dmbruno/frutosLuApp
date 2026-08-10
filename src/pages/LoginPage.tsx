import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout title="Frutos Lu" subtitle="Entrená con tu profe, a tu ritmo.">
      <LoginForm />
    </AuthLayout>
  );
}
