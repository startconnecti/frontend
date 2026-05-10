'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Tutor, AvailabilitySlot } from '../types';
import { useCreateBookingMutation } from '@/features/bookings/hooks/use-create-booking-mutation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TutorBookingSummaryCardProps {
  tutor: Tutor;
}

export function TutorBookingSummaryCard({ tutor }: TutorBookingSummaryCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || '');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string>('');
  
  const bookingMutation = useCreateBookingMutation();

  const handleBook = () => {
    if (!isAuthenticated) return;
    if (user?.role === 'tutor') {
      toast.error('Tutors cannot book sessions');
      return;
    }
    if (!selectedSlotIndex) {
      toast.error('Please select a time slot');
      return;
    }

    const slot = tutor.availabilitySlots[parseInt(selectedSlotIndex)];
    
    bookingMutation.mutate({
      tutorId: tutor.id,
      subject: selectedSubject,
      startTime: slot.startTime,
      endTime: slot.endTime,
      dayOfWeek: slot.dayOfWeek || slot.day || '',
      availabilityId: slot.id,
    });
  };

  const isTutorSelf = user?.id === tutor.id;
  const isBookingDisabled = bookingMutation.isPending || !selectedSlotIndex || isTutorSelf;

  return (
    <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 bg-background overflow-hidden">
      <CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-baseline gap-1">
          <PriceDisplay amount={tutor.hourlyRate} size="xl" className="text-primary font-black" />
          <span className="text-sm text-muted-foreground font-medium">/ hour</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Selectors */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-border/40 font-medium">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {tutor.subjects.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Availability</label>
            <Select value={selectedSlotIndex} onValueChange={setSelectedSlotIndex}>
              <SelectTrigger className="rounded-xl border-border/40 font-medium">
                <SelectValue placeholder="Select a slot" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {tutor.availabilitySlots.map((slot, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    <span className="capitalize">{slot.dayOfWeek || slot.day}</span>: {slot.startTime} - {slot.endTime}
                  </SelectItem>
                ))}
                {tutor.availabilitySlots.length === 0 && (
                  <SelectItem value="none" disabled>No availability listed</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Free 15-minute consultation</p>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Easy online booking</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Satisfaction guarantee</p>
          </div>
        </div>

        <div className="space-y-3">
          {!isAuthenticated ? (
            <>
              <p className="text-[10px] text-center text-muted-foreground px-4 uppercase font-black tracking-widest">
                Login to book a session
              </p>
              <Button className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl" asChild>
                <Link href={`${ROUTES.LOGIN}?redirect=/tutors/${tutor.id}`}>
                  Login to Book
                </Link>
              </Button>
            </>
          ) : isTutorSelf ? (
            <p className="text-xs text-center text-amber-600 font-bold px-4 bg-amber-50 py-2 rounded-lg border border-amber-100">
              You cannot book yourself
            </p>
          ) : user?.role === 'tutor' ? (
             <p className="text-xs text-center text-amber-600 font-bold px-4 bg-amber-50 py-2 rounded-lg border border-amber-100">
              Tutors cannot book sessions
            </p>
          ) : (
            <Button 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl" 
              onClick={handleBook}
              disabled={isBookingDisabled}
            >
              {bookingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book a Lesson'
              )}
            </Button>
          )}
          
          <Button variant="outline" className="w-full h-12 text-base font-bold rounded-xl" asChild>
            <Link href={isAuthenticated ? ROUTES.MESSAGES : ROUTES.LOGIN}>
              Send a Message
            </Link>
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 p-4 justify-center">
        <p className="text-[10px] text-muted-foreground text-center">
          By booking, you agree to our <span className="underline cursor-pointer">Refund Policy</span>
        </p>
      </CardFooter>
    </Card>
  );
}
