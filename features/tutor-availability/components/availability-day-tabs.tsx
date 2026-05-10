'use client';

import { DayOfWeek } from '../types';
import { cn } from '@/lib/utils';

interface AvailabilityDayTabsProps {
  activeDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
  slotsCountByDay: Record<DayOfWeek, number>;
}

const DAYS: { label: string; value: DayOfWeek }[] = [
  { label: 'Mon', value: 'monday' },
  { label: 'Tue', value: 'tuesday' },
  { label: 'Wed', value: 'wednesday' },
  { label: 'Thu', value: 'thursday' },
  { label: 'Fri', value: 'friday' },
  { label: 'Sat', value: 'saturday' },
  { label: 'Sun', value: 'sunday' },
];

export function AvailabilityDayTabs({ activeDay, onDayChange, slotsCountByDay }: AvailabilityDayTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {DAYS.map((day) => {
        const count = slotsCountByDay[day.value] || 0;
        const isActive = activeDay === day.value;

        return (
          <button
            key={day.value}
            onClick={() => onDayChange(day.value)}
            className={cn(
              "flex flex-col items-center justify-center w-20 py-3 rounded-2xl border-2 transition-all",
              isActive 
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                : "bg-white border-border/40 text-muted-foreground hover:border-border hover:bg-muted/30"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-80">
              {day.label}
            </span>
            <span className="text-xl font-black">{count}</span>
            <span className="text-[10px] font-bold opacity-60">Slots</span>
          </button>
        );
      })}
    </div>
  );
}
