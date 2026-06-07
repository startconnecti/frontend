'use client';

import { AvailabilitySlot } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvailabilityCalendarPreviewProps {
  slots: AvailabilitySlot[];
  timezone?: string;
}

export function AvailabilityCalendarPreview({ slots, timezone }: AvailabilityCalendarPreviewProps) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  
  if (slots.length === 0) {
    return (
      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 border-b border-border/40 p-6">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <CalendarIcon className="h-4 w-4 text-primary" />
            Weekly Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
            <CalendarIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h4 className="text-sm font-bold text-muted-foreground">No weekly availability configured yet.</h4>
          <p className="text-xs text-muted-foreground/60 max-w-[250px]">Add your first availability slot to start accepting bookings.</p>
        </CardContent>
      </Card>
    );
  }

  const availableDays = new Set(slots.map(s => s.dayOfWeek)).size;
  const totalHours = Math.round(slots.reduce((sum, slot) => {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    return sum + (endH + endM / 60) - (startH + startM / 60);
  }, 0));

  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

  return (
    <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="bg-primary/5 border-b border-border/40 p-6">
        <div className="space-y-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <CalendarIcon className="h-4 w-4 text-primary" />
            Weekly Availability Calendar
          </CardTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-border/40">
              <Layers className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Slots / Days</p>
                <p className="text-xs font-bold text-brand-dark">{slots.length} Slots · {availableDays} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-border/40">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Hours</p>
                <p className="text-xs font-bold text-brand-dark">~{totalHours} hrs / wk</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-center"></div>
            {days.map(day => (
              <div key={day} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          
          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-1 items-center">
                <div className="text-[9px] font-bold text-muted-foreground/60 text-right pr-2">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {days.map(day => {
                  const isActive = slots.some(s => {
                    if (s.dayOfWeek !== day) return false;
                    const start = parseInt(s.startTime.replace(':', ''));
                    const end = parseInt(s.endTime.replace(':', ''));
                    const current = hour * 100;
                    // Hour block is active if it falls within the slot
                    return current >= start && current < end;
                  });

                  return (
                    <div 
                      key={`${day}-${hour}`}
                      className={cn(
                        "h-6 rounded flex items-center justify-center text-[8px] font-bold transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground border border-primary/20 shadow-sm" 
                          : "bg-muted/30 border border-border/40"
                      )}
                    >
                      {isActive && "✓"}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
