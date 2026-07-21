import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
