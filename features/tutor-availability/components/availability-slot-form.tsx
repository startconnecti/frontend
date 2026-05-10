'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DayOfWeek } from '../types';

const slotSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
}).refine((data) => {
  const start = parseInt(data.startTime.replace(':', ''));
  const end = parseInt(data.endTime.replace(':', ''));
  return start < end;
}, {
  message: "Start time must be before end time",
  path: ["endTime"],
});

interface AvailabilitySlotFormProps {
  onAdd: (startTime: string, endTime: string) => void;
  disabled: boolean;
}

export function AvailabilitySlotForm({ onAdd, disabled }: AvailabilitySlotFormProps) {
  const form = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      startTime: '09:00',
      endTime: '10:00',
    },
  });

  const onSubmit = (values: z.infer<typeof slotSchema>) => {
    onAdd(values.startTime, values.endTime);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-end gap-4 bg-muted/20 p-6 rounded-3xl border border-border/40">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="h-12 rounded-xl bg-white font-bold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} className="h-12 rounded-xl bg-white font-bold" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="h-12 px-6 font-black rounded-xl gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95"
          disabled={disabled}
        >
          <Plus className="h-5 w-5" />
          Add Slot
        </Button>
      </form>
    </Form>
  );
}
