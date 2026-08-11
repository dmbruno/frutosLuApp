interface WeekTabsProps {
  weekNumbers: number[];
  activeWeek: number;
  onSelect: (week: number) => void;
  onAddWeek: () => void;
  onDuplicatePrevious: () => void;
}

export function WeekTabs({ weekNumbers, activeWeek, onSelect, onAddWeek, onDuplicatePrevious }: WeekTabsProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto border-b border-neutral-200 pb-2">
      {weekNumbers.map((week) => (
        <button
          key={week}
          onClick={() => onSelect(week)}
          className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            week === activeWeek ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Semana {week}
        </button>
      ))}
      <button
        onClick={onAddWeek}
        className="shrink-0 cursor-pointer rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
      >
        + Semana
      </button>
      {activeWeek > 1 && (
        <button
          onClick={onDuplicatePrevious}
          className="shrink-0 cursor-pointer rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200"
        >
          Duplicar anterior
        </button>
      )}
    </div>
  );
}
