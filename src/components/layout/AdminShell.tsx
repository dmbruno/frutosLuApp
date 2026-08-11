import type { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import { AdminBottomNav } from './AdminBottomNav';
import { AdminHeader } from './AdminHeader';
import { AdminHeaderProvider } from '../../lib/AdminHeaderContext';

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <AdminHeaderProvider>
      <div className="fixed inset-0 flex bg-white">
        <Sidebar />
        <AdminHeader />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6 pt-[8.5rem] pb-20 md:pt-6 md:pb-6">
          {children}
        </main>
        <AdminBottomNav />
      </div>
    </AdminHeaderProvider>
  );
}
