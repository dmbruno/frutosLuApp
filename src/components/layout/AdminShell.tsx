import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { AdminBottomNav } from './AdminBottomNav';

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="fixed inset-0 flex bg-white">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-6 pb-20 md:pb-6">{children}</main>
      <AdminBottomNav />
    </div>
  );
}
