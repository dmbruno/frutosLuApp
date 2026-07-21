import type { PropsWithChildren } from 'react';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
