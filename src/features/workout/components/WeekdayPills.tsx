import type { WeekDay } from '../../../types/domain';

const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

interface WeekdayPillsProps {
  days: WeekDay[];
  todayDayId: string | null;
}

export function WeekdayPills({ days, todayDayId }: WeekdayPillsProps) {
  if (days.length === 0) return null;

  return (
    <div className="flex gap-2">
      {days.map((day, index) => {
        const letter = WEEKDAY_LETTERS[((day.weekday ?? index + 1) - 1 + 7) % 7];
        const isToday = day.id === todayDayId;

        if (isToday) {
          return (
            <span
              key={day.id}
              className="flex h-9 items-center justify-center rounded-full border-2 border-neutral-900 px-3 text-sm font-semibold text-neutral-900"
            >
              {day.completed ? `${letter} ✓` : `${letter} hoy`}
            </span>
          );
        }

        if (day.completed) {
          return (
            <span
              key={day.id}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink text-sm font-medium text-white"
            >
              {letter}✓
            </span>
          );
        }

        return (
          <span
            key={day.id}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-sm font-medium text-neutral-300"
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
}
