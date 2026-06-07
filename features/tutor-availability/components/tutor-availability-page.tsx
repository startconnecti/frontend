'use client';

import { useState } from 'react';
import { Globe, Save } from 'lucide-react';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useTutorAvailabilityQuery } from '../hooks/use-tutor-availability-query';
import { useCreateTutorAvailabilityMutation } from '../hooks/use-create-tutor-availability-mutation';
import { useDeleteTutorAvailabilityMutation } from '../hooks/use-delete-tutor-availability-mutation';
import { AvailabilityDayTabs } from './availability-day-tabs';
import { AvailabilitySlotList } from './availability-slot-list';
import { AvailabilitySlotForm } from './availability-slot-form';
import { AvailabilityCalendarPreview } from './availability-calendar-preview';
import { DayOfWeek, AvailabilitySlot } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function TutorAvailabilityPage() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('monday');
  const { data: availability, isLoading, isError, refetch } = useTutorAvailabilityQuery();
  const createMutation = useCreateTutorAvailabilityMutation();
  const deleteMutation = useDeleteTutorAvailabilityMutation();

  const handleAddSlot = (startTime: string, endTime: string) => {
    if (!availability) return;

    // Validation: Overlap
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    
    const slots = availability?.slots ?? [];
    
    const isOverlapping = slots
      .filter(s => s.dayOfWeek === activeDay)
      .some(s => {
        const sStart = parseInt(s.startTime.replace(':', ''));
        const sEnd = parseInt(s.endTime.replace(':', ''));
        return (start < sEnd && end > sStart);
      });

    if (isOverlapping) {
      toast.error('This slot overlaps with an existing one');
      return;
    }

    createMutation.mutate({
      day_of_week: activeDay,
      start_time: startTime,
      end_time: endTime,
    });
  };

  const handleRemoveSlot = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-10">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer className="py-8">
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark">Failed to load availability</h2>
          <p className="text-muted-foreground max-w-md">There was an error fetching your availability schedule. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline">Retry</Button>
        </div>
      </PageContainer>
    );
  }

  const slots = availability?.slots ?? [];
  const activeDaySlots = slots.filter(s => s.dayOfWeek === activeDay);
  const slotsCountByDay = slots.reduce((acc, slot) => {
    acc[slot.dayOfWeek] = (acc[slot.dayOfWeek] || 0) + 1;
    return acc;
  }, {} as Record<DayOfWeek, number>);

  return (
    <PageContainer className="py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <SectionHeader 
          title="Availability Management"
          description="Define your weekly teaching schedule so students can book sessions with you."
        />
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <Globe className="h-4 w-4 text-emerald-600" />
          <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">{availability?.timezone}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Management Area */}
        <div className="lg:col-span-2 space-y-8">
          <AvailabilityDayTabs 
            activeDay={activeDay} 
            onDayChange={setActiveDay} 
            slotsCountByDay={slotsCountByDay}
          />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-widest text-brand-dark">
                {activeDay} Slots
              </h3>
              <p className="text-xs text-muted-foreground font-medium">{activeDaySlots.length} active slots</p>
            </div>

            <AvailabilitySlotList 
              slots={activeDaySlots} 
              onRemove={handleRemoveSlot} 
            />

            <AvailabilitySlotForm 
              onAdd={handleAddSlot} 
              disabled={createMutation.isPending} 
            />
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="space-y-8">
          <AvailabilityCalendarPreview slots={slots} />
          
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <h4 className="font-black text-sm uppercase tracking-widest text-brand-dark">Scheduling Tips</h4>
            <ul className="space-y-3">
              {[
                'Keep 15-min buffers between slots',
                'Ensure your timezone is correct',
                'Update weekly for better booking rates'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
