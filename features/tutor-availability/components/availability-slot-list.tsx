'use client';

import { Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { AvailabilitySlot } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AvailabilitySlotListProps {
  slots: AvailabilitySlot[];
  onRemove: (id: string) => void;
}

export function AvailabilitySlotList({ slots, onRemove }: AvailabilitySlotListProps) {
  if (slots.length === 0) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/5">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h4 className="text-sm font-bold text-muted-foreground">No slots added for this day</h4>
        <p className="text-xs text-muted-foreground/60 mt-1">Add a new time slot to start receiving bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => (
        <div 
          key={slot.id} 
          className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border/60 shadow-sm transition-all hover:shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: '#2C1208' }}>
                {slot.startTime} — {slot.endTime}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-lg opacity-0 group-hover:opacity-100"
            onClick={() => onRemove(slot.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
