import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredEvent || dismissed) return null;

  async function handleInstall() {
    await deferredEvent!.prompt();
    await deferredEvent!.userChoice;
    setDeferredEvent(null);
  }

  return (
    <div className="fixed inset-x-4 bottom-20 z-30 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-lg">
      <p className="text-sm font-medium">Instalá Frutos Lu en tu teléfono</p>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => setDismissed(true)} className="text-sm text-neutral-400">
          Ahora no
        </button>
        <button onClick={handleInstall} className="rounded-full bg-brand-pink px-3 py-1 text-sm font-medium text-white">
          Instalar
        </button>
      </div>
    </div>
  );
}
