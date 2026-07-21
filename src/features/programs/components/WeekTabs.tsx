interface WeekTabsProps {
  weekNumbers: number[];
  activeWeek: number;
  onSelect: (week: number) => void;
  onAddWeek: () => void;
  onDuplicatePrevious: () => void;
}

export function WeekTabs({ weekNumbers, activeWeek, onSelect, onAddWeek, onDuplicatePrevious }: WeekTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-200 pb-2">
      {weekNumbers.map((week) => (
        <button
          key={week}
          onClick={() => onSelect(week)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
            week === activeWeek ? 'bg-brand-pink text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Semana {week}
        </button>
      ))}
      <button
        onClick={onAddWeek}
        className="shrink-0 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600"
      >
        + Semana
      </button>
      {activeWeek > 1 && (
        <button
          onClick={onDuplicatePrevious}
          className="shrink-0 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-600"
        >
          Duplicar anterior
        </button>
      )}
    </div>
  );
}
