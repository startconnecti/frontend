'use client';

import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AvailabilitySlot } from '../types';

interface TutorProfileAvailabilityProps {
  slots: AvailabilitySlot[];
}

export function TutorProfileAvailability({ slots }: TutorProfileAvailabilityProps) {
  if (!slots || slots.length === 0) return null;

  // Group slots by day
  const groupedSlots = slots.reduce((acc, slot) => {
    const day = slot.day || slot.dayOfWeek;
    if (!day) return acc;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Availability</h2>
        <Badge variant="outline" className="text-[10px] h-5">Standard Weekly Schedule</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {daysOrder.map((day) => {
          const daySlots = groupedSlots[day];
          if (!daySlots) return null;

          return (
            <div key={day} className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-sm capitalize">{day}</h4>
              </div>
              <div className="space-y-2">
                {daySlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1.5 bg-background rounded-lg border border-border/20">
                    <Clock className="h-3 w-3" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground italic mt-2">
        * Times are shown in your local timezone.
      </p>
    </div>
  );
}
