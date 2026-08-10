import type { PropsWithChildren, ReactNode } from 'react';

interface AuthLayoutProps {
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-6 bg-white p-6 pt-20">
      <img
        src="/logos/AvatarFrutosLu-08.jpg"
        alt="Frutos Lu"
        className="h-24 w-24 rounded-full border border-neutral-200 object-cover"
      />
      {title && (
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
