import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from './InstallPrompt';
import { StudentHeader } from './StudentHeader';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <StudentHeader />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pt-[8.5rem] pb-20">{children}</main>
      <InstallPrompt />
      <BottomNav />
    </div>
  );
}
