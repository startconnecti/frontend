'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Tutor, AvailabilitySlot, Subject } from '../types';
import { Booking } from '@/features/bookings/types';
import { useCreatePaymentMutation } from '@/features/payments/hooks/use-create-payment-mutation';
import { useCreateBookingMutation } from '@/features/bookings/hooks/use-create-booking-mutation';
import { useSubjectsQuery } from '../hooks/use-subjects-query';
import { PaymentMethod, PaymentInstruction } from '@/features/payments/types';
import { PaymentInstructionModal } from '@/features/payments/components/payment-instruction-modal';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { generateHourlySlots } from '../utils';
import { paymentService } from '@/features/payments/services/payment-service';

interface TutorBookingSummaryCardProps {
  tutor: Tutor;
}

const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Represents a single 1-hour bookable slot derived from a raw AvailabilitySlot window.
 */
interface HourlySlotOption {
  /** Composite key used as the <Select> value — unique per option */
  key: string;
  /** The parent AvailabilitySlot (holds the id for the booking payload) */
  parentSlot: AvailabilitySlot;
  /** Day label e.g. "Monday" */
  dayLabel: string;
  /** HH:mm of the 1-hour slot start */
  hourlyStart: string;
  /** HH:mm of the 1-hour slot end */
  hourlyEnd: string;
}

/** Expand all raw availability windows into 1-hour bookable slot options. */
function buildHourlyOptions(availabilitySlots: AvailabilitySlot[]): HourlySlotOption[] {
  const options: HourlySlotOption[] = [];

  for (const slot of availabilitySlots) {
    const dayLabel = slot.dayOfWeek || slot.day || '';
    const hourStrings = generateHourlySlots(slot.startTime, slot.endTime);

    for (const hourStr of hourStrings) {
      const [hourlyStart, hourlyEnd] = hourStr.split('-');
      options.push({
        key: `${slot.id}-${hourlyStart}`,
        parentSlot: slot,
        dayLabel,
        hourlyStart,
        hourlyEnd,
      });
    }
  }

  return options;
}

export function TutorBookingSummaryCard({ tutor }: TutorBookingSummaryCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedOptionKey, setSelectedOptionKey] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activePaymentData, setActivePaymentData] = useState<{ instruction: PaymentInstruction; paymentId: string } | null>(null);

  const bookingMutation = useCreateBookingMutation();
  const { mutate: createPayment, isPending: isCreatingPayment } = useCreatePaymentMutation();

  // Fetch the master subjects list (used as fallback if tutor.subjectObjects is absent)
  const { data: allSubjects = [] } = useSubjectsQuery();

  // Resolve subject list with UUIDs
  const tutorSubjects: { id: string; name: string }[] = (() => {
    if (tutor.subjectObjects && tutor.subjectObjects.length > 0) {
      return tutor.subjectObjects;
    }
    return allSubjects.filter((s) =>
      tutor.subjects.some((name) => name.toLowerCase() === s.name.toLowerCase())
    );
  })();

  const firstSubjectId = tutorSubjects[0]?.id ?? '';

  // Expand all availability windows into 1-hour selectable options
  const hourlyOptions = buildHourlyOptions(tutor.availabilitySlots || []);

  // Resolve the currently selected option object
  const selectedOption = hourlyOptions.find((o) => o.key === selectedOptionKey) ?? null;

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a session.');
      return;
    }

    if (user?.role === 'tutor') {
      toast.error('Tutors cannot book sessions.');
      return;
    }

    if (!selectedOption) {
      toast.error('Please select a time slot before booking.');
      return;
    }

    const effectiveSubjectId = selectedSubjectId || firstSubjectId;
    if (!effectiveSubjectId) {
      toast.error(
        allSubjects.length === 0
          ? 'Subject list is still loading — please wait a moment and try again.'
          : 'Could not resolve a subject ID. Please select a subject.'
      );
      return;
    }

    const { parentSlot, hourlyStart } = selectedOption;

    if (!parentSlot.id) {
      toast.error('This time slot is missing its ID — the page may need a refresh.');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a specific date for your lesson.');
      return;
    }

    const [startHour, startMinute] = hourlyStart.split(':').map(Number);
    const startTarget = new Date(selectedDate);
    startTarget.setHours(startHour, startMinute, 0, 0);
    const endTarget = new Date(startTarget.getTime() + 60 * 60 * 1000);

    const payload = {
      tutor_id: tutor.id,
      subject_id: effectiveSubjectId,
      weekly_availability_id: parentSlot.id,
      start_time: startTarget.toISOString(),
      end_time: endTarget.toISOString(),
    };

    bookingMutation.mutate(payload, {
      onSuccess: (data) => {
        const booking = (data as any)?.booking || (data as any)?.data?.booking || data;
        const bookingId: string | undefined = booking?.bookingId || booking?.id;
        const bookingCode = booking?.bookingCode || bookingId?.slice(-6)?.toUpperCase() || 'PENDING';

        toast.success(`Booking created! Reference: #${bookingCode}. Opening payment...`);

        // Reset selections
        setSelectedOptionKey('');
        setSelectedDate(undefined);

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['student-bookings'] });
        queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });

        // Automatically open the payment flow
        if (bookingId) {
          createPayment(bookingId, {
            onSuccess: (response) => {
              const payload = (response as any)?.data || response;
              if (!payload?.paymentInstruction) {
                toast.error('Missing payment instruction from server.');
                return;
              }
              setActivePaymentData({
                instruction: payload.paymentInstruction,
                paymentId: payload.payment?.id || payload.payment?.paymentId,
              });
            },
            onError: () => {
              toast.error('Booking created, but could not initialize payment. Please use Pay Now from your bookings.');
            },
          });
        }
      },
      onError: (error: any) => {
        const backendErrorMessage = error?.response?.data?.error?.message || error?.error?.message || error?.message;
        toast.error(backendErrorMessage || 'Failed to create booking');
      }
    });
  };

  const isTutorSelf = user?.id === tutor.id;
  const isBookingDisabled = bookingMutation.isPending || isCreatingPayment || !selectedOptionKey || isTutorSelf;

  // Determine the day number to restrict the calendar picker
  const selectedDayNum = selectedOption
    ? DAY_MAP[(selectedOption.dayLabel).toLowerCase()]
    : undefined;

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
        <div className="flex flex-col space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
            {tutorSubjects.length > 0 ? (
              <Select
                value={selectedSubjectId || firstSubjectId}
                onValueChange={setSelectedSubjectId}
              >
                <SelectTrigger className="rounded-xl border-border/40 font-medium">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {tutorSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="rounded-xl border-border/40 font-medium">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {(tutor.subjects || []).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Time Slot</label>
            <Select 
              value={selectedOptionKey} 
              onValueChange={(val) => {
                setSelectedOptionKey(val);
                setSelectedDate(undefined); // Reset date when slot changes
              }}
            >
              <SelectTrigger className="rounded-xl border-border/40 font-medium">
                <SelectValue placeholder="Select a 1-hour slot" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {hourlyOptions.length > 0 ? (
                  hourlyOptions.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      <span className="capitalize">{opt.dayLabel}</span>: {opt.hourlyStart} – {opt.hourlyEnd}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No availability listed</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-medium rounded-xl border-border/40 h-10",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl border-border/40" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    if (selectedDayNum !== undefined && date.getDay() !== selectedDayNum) {
                      return true;
                    }
                    return false;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">Easy online booking</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
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
              ) : isCreatingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing Payment...
                </>
              ) : (
                'Book a Lesson'
              )}
            </Button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 p-4 justify-center">
        <p className="text-[10px] text-muted-foreground text-center">
          By booking, you agree to our <span className="underline cursor-pointer">Refund Policy</span>
        </p>
      </CardFooter>

      {activePaymentData && (
        <PaymentInstructionModal
          isOpen={!!activePaymentData}
          onClose={() => setActivePaymentData(null)}
          instruction={activePaymentData.instruction}
          paymentId={activePaymentData.paymentId}
        />
      )}
    </Card>
  );
}
