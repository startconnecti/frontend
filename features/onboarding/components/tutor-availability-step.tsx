'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Clock } from 'lucide-react';
import { DAYS_OF_WEEK } from '../constants';
import { TutorOnboardingRequest, TutorOnboardingAvailability } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorAvailabilityStep({ data, onChange, errors }: StepProps) {
  const addAvailability = () => {
    const newAvail: TutorOnboardingAvailability = {
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
    };
    onChange({ weeklyAvailability: [...data.weeklyAvailability, newAvail] });
  };

  const removeAvailability = (index: number) => {
    onChange({ weeklyAvailability: data.weeklyAvailability.filter((_, i) => i !== index) });
  };

  const updateAvailability = (index: number, field: keyof TutorOnboardingAvailability, value: string) => {
    const newAvail = [...data.weeklyAvailability];
    newAvail[index] = { ...newAvail[index], [field]: value };
    onChange({ weeklyAvailability: newAvail });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-bold">Weekly Availability</label>
          <p className="text-[10px] text-muted-foreground italic">Set your recurring teaching hours.</p>
        </div>
        <Button variant="outline" size="sm" onClick={addAvailability} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-3">
        {data.weeklyAvailability.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-border/40 text-center space-y-3 bg-muted/5">
            <Clock className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No availability slots added yet.</p>
          </div>
        ) : (
          data.weeklyAvailability.map((avail, index) => (
            <div key={index} className="flex flex-wrap items-end gap-4 p-4 rounded-xl border border-border/60 bg-muted/5 relative pr-12">
              <div className="w-full sm:w-auto flex-1 min-w-[150px] space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Day</label>
                <Select 
                  value={avail.dayOfWeek} 
                  onValueChange={(val) => updateAvailability(index, 'dayOfWeek', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-auto flex-1 min-w-[120px] space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Start</label>
                <Input 
                  type="time" 
                  value={avail.startTime} 
                  onChange={(e) => updateAvailability(index, 'startTime', e.target.value)} 
                  className={errors?.[`avail_${index}`] ? 'border-destructive' : ''}
                />
              </div>

              <div className="w-full sm:w-auto flex-1 min-w-[120px] space-y-2">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">End</label>
                <Input 
                  type="time" 
                  value={avail.endTime} 
                  onChange={(e) => updateAvailability(index, 'endTime', e.target.value)} 
                  className={errors?.[`avail_${index}`] ? 'border-destructive' : ''}
                />
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1/2 -translate-y-1/2 right-2 text-destructive hover:bg-destructive/10 h-8 w-8" 
                onClick={() => removeAvailability(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              {errors?.[`avail_${index}`] && (
                <p className="w-full text-[10px] text-destructive font-medium mt-1">{errors[`avail_${index}`]}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
