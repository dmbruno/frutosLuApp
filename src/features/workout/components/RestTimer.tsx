import { SkipForward } from 'lucide-react';

interface RestTimerProps {
  secondsLeft: number;
  onSkip: () => void;
}

export function RestTimer({ secondsLeft, onSkip }: RestTimerProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-neutral-950 text-white">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Descanso</p>
      <p className="font-display text-8xl font-extrabold tabular-nums">{secondsLeft}</p>
      <button
        onClick={onSkip}
        aria-label="Saltar descanso"
        className="mt-4 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
      >
        <SkipForward size={22} fill="white" />
      </button>
    </div>
  );
}
