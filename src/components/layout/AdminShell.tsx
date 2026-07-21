import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { AdminBottomNav } from './AdminBottomNav';

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 pb-20 md:pb-6">{children}</main>
      <AdminBottomNav />
    </div>
  );
}
