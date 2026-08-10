import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';
import { InstallPrompt } from './InstallPrompt';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20">{children}</main>
      <InstallPrompt />
      <BottomNav />
    </div>
  );
}
