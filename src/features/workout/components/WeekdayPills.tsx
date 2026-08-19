import { Check } from 'lucide-react';
import type { WeekDay } from '../../../types/domain';

interface WeekdayPillsProps {
  days: WeekDay[];
  todayDayId: string | null;
}

export function WeekdayPills({ days, todayDayId }: WeekdayPillsProps) {
  if (days.length === 0) return null;

  return (
    <div className="flex gap-3">
      {days.map((day, index) => {
        const dayNumber = index + 1;
        const isToday = day.id === todayDayId;

        return (
          <div key={day.id} className="relative flex flex-col items-center gap-1">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                isToday
                  ? 'border-2 border-brand-pink text-brand-pink'
                  : day.completed
                    ? 'bg-neutral-100 text-neutral-500'
                    : 'border border-neutral-200 text-neutral-300'
              }`}
            >
              {dayNumber}
            </span>
            {day.completed && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-white">
                <Check size={10} strokeWidth={3} />
              </span>
            )}
            {isToday && <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-pink">hoy</span>}
          </div>
        );
      })}
    </div>
  );
}
