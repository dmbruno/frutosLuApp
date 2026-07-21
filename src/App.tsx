import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { router } from './routes';
import { registerOfflineQueueSync } from './features/workout/offlineQueue';
import { ToastProvider } from './lib/ToastProvider';

export function App() {
  useEffect(() => {
    registerOfflineQueueSync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
