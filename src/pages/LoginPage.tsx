import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-[#FEE9E6] p-6 pt-20">
      <img src="/logos/AvatarFrutosLu-08.jpg" alt="Frutos Lu" className="h-48 w-48 rounded-full object-cover" />
      <LoginForm />
    </div>
  );
}
