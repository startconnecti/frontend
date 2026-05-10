'use client';

import { AvailabilitySlot } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

interface AvailabilityCalendarPreviewProps {
  slots: AvailabilitySlot[];
}

export function AvailabilityCalendarPreview({ slots }: AvailabilityCalendarPreviewProps) {
  // A very simplified visual preview representing the density of slots
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  
  return (
    <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="bg-primary/5 border-b border-border/40 p-6">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
          <CalendarIcon className="h-4 w-4 text-primary" />
          Schedule Density Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-2 h-40 items-end">
          {days.map((day) => {
            const daySlots = slots.filter(s => s.dayOfWeek === day);
            const height = Math.min(daySlots.length * 20, 100); // Simple height logic
            
            return (
              <div key={day} className="flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary group-hover:scale-110" 
                  style={{ height: `${height + 10}%` }}
                />
                <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground">
                  {day.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/40">
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground font-medium italic">
            This preview helps you visualize your weekly workload balance at a glance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
