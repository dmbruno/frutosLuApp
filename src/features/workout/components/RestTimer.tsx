interface RestTimerProps {
  secondsLeft: number;
  onSkip: () => void;
}

export function RestTimer({ secondsLeft, onSkip }: RestTimerProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black/80 text-white">
      <p className="text-sm uppercase tracking-wide text-neutral-300">Descanso</p>
      <p className="font-display text-6xl font-bold">{secondsLeft}s</p>
      <button
        onClick={onSkip}
        className="cursor-pointer rounded-full border border-white/40 px-6 py-2 text-sm transition-colors hover:bg-white/10"
      >
        Saltar
      </button>
    </div>
  );
}
