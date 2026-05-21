'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
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

function getNextSlotOccurrence(dayOfWeekStr: string, startTimeStr: string, endTimeStr: string) {
  const targetDay = DAY_MAP[dayOfWeekStr.toLowerCase()];
  if (targetDay === undefined) {
    throw new Error(`Invalid day of week: ${dayOfWeekStr}`);
  }

  const now = new Date();
  
  // Parse HH:mm
  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  const [endHour, endMinute] = endTimeStr.split(':').map(Number);

  // We construct a Date object for the next occurrence in local timezone
  // Start from today at the exact start time
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0, 0);
  
  // Calculate how many days to add to reach the target day of the week
  let daysToAdd = (targetDay - now.getDay() + 7) % 7;
  
  // Apply days addition
  targetDate.setDate(targetDate.getDate() + daysToAdd);
  
  // If the calculated time is less than 24 hours from now, push it to next week
  const msIn24Hours = 24 * 60 * 60 * 1000;
  if (targetDate.getTime() - now.getTime() < msIn24Hours) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  // The backend strictly enforces SLOT_DURATION_MINUTES = 60.
  // We book the first 60 minutes of the selected availability window.
  const endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);

  return {
    start_time: targetDate.toISOString(),
    end_time: endDate.toISOString(),
  };
}

export function TutorBookingSummaryCard({ tutor }: TutorBookingSummaryCardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  // selectedSubjectId stores the UUID from the subjects master list
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('manual_bank_transfer');
  const [bookingResponse, setBookingResponse] = useState<Booking | null>(null);
  const [activePaymentData, setActivePaymentData] = useState<{ instruction: PaymentInstruction; paymentId: string } | null>(null);
  
  const bookingMutation = useCreateBookingMutation();
  const paymentMutation = useCreatePaymentMutation();

  // Fetch the master subjects list (used as fallback if tutor.subjectObjects is absent)
  const { data: allSubjects = [] } = useSubjectsQuery();

  // Resolve subject list with UUIDs:
  // Path A (preferred): backend returned {id, name} objects in tutor.subjects → stored in subjectObjects
  // Path B (fallback):  cross-reference the master subjects list by name (case-insensitive)
  const tutorSubjects: { id: string; name: string }[] = (() => {
    if (tutor.subjectObjects && tutor.subjectObjects.length > 0) {
      return tutor.subjectObjects;
    }
    // fallback: match names case-insensitively against the master list
    return allSubjects.filter((s) =>
      tutor.subjects.some((name) => name.toLowerCase() === s.name.toLowerCase())
    );
  })();

  // Initialize selectedSubjectId once subjects are loaded
  const firstSubjectId = tutorSubjects[0]?.id ?? '';


  const handleBook = () => {
    // ── DEBUG: dump all relevant state ──────────────────────────────────────
    console.log('[handleBook] clicked', {
      isAuthenticated,
      userRole: user?.role,
      selectedSubjectId,
      firstSubjectId,
      selectedSlotIndex,
      tutorId: tutor.id,
      tutorSubjectsNames: tutor.subjects,
      subjectObjects: tutor.subjectObjects,
      tutorSubjectsResolved: tutorSubjects,
      allSubjectsCount: allSubjects.length,
      availabilitySlots: tutor.availabilitySlots,
    });
    // ─────────────────────────────────────────────────────────────────────────

    if (!isAuthenticated) {
      console.error('[handleBook] blocked: not authenticated');
      toast.error('Please log in to book a session.');
      return;
    }

    if (user?.role === 'tutor') {
      console.error('[handleBook] blocked: user is a tutor');
      toast.error('Tutors cannot book sessions.');
      return;
    }

    if (!selectedSlotIndex) {
      console.error('[handleBook] blocked: no time slot selected');
      toast.error('Please select a time slot before booking.');
      return;
    }

    // Resolve subject_id: prefer explicit selection, fall back to first available
    const effectiveSubjectId = selectedSubjectId || firstSubjectId;
    console.log('[handleBook] effectiveSubjectId:', effectiveSubjectId);

    if (!effectiveSubjectId) {
      console.error('[handleBook] blocked: cannot resolve subject UUID.', {
        tutorSubjects,
        allSubjectsCount: allSubjects.length,
        subjectObjects: tutor.subjectObjects,
      });
      toast.error(
        allSubjects.length === 0
          ? 'Subject list is still loading — please wait a moment and try again.'
          : 'Could not resolve a subject ID. Please select a subject.'
      );
      return;
    }

    const slotIdx = parseInt(selectedSlotIndex, 10);
    const slot = tutor.availabilitySlots[slotIdx];
    console.log('[handleBook] resolved slot (index=' + slotIdx + '):', slot);

    if (!slot) {
      console.error('[handleBook] blocked: slot not found at index', slotIdx);
      toast.error('Selected time slot is invalid. Please refresh the page and choose again.');
      return;
    }

    if (!slot.id) {
      console.error('[handleBook] blocked: slot.id is missing (backend did not return ID):', slot);
      toast.error('This time slot is missing its ID — the page may need a refresh.');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a specific date for your lesson.');
      return;
    }

    // Safe ISO datetime construction from selected calendar date
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const startTarget = new Date(selectedDate);
    startTarget.setHours(startHour, startMinute, 0, 0);

    // The backend strictly enforces SLOT_DURATION_MINUTES = 60.
    const endTarget = new Date(startTarget.getTime() + 60 * 60 * 1000);

    const payload = {
      tutor_id: tutor.id,
      subject_id: effectiveSubjectId,
      weekly_availability_id: slot.id,
      start_time: startTarget.toISOString(),
      end_time: endTarget.toISOString(),
    };
    console.log('Exact payload being sent:', payload);

    bookingMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log('[handleBook] booking success:', data);
        setBookingResponse(data);
      },
      onError: (error: any) => {
        const backendErrorMessage = error?.response?.data?.error?.message || error?.error?.message || error?.message;
        toast.error(backendErrorMessage || 'Failed to create booking');
      }
    });
  };


  const handlePay = () => {
    // Safely extract booking ID (accommodating unwrapped or wrapped API responses)
    const booking = (bookingResponse as any)?.booking || (bookingResponse as any)?.data?.booking || bookingResponse;
    const paymentId = booking?.paymentId;
    const bookingId = booking?.id || booking?.bookingId;

    // Case B: If paymentId already exists in booking response, redirect directly
    if (paymentId) {
      router.push(ROUTES.STUDENT.PAYMENT_DETAIL(paymentId));
      return;
    }

    if (!bookingId) return;
    
    paymentMutation.mutate(bookingId, {
      onSuccess: (response) => {
        const payload = (response as any)?.data || response;
        if (!payload?.paymentInstruction) {
          toast.error("Missing payment instruction from server.");
          return;
        }
        setActivePaymentData({
          instruction: payload.paymentInstruction,
          paymentId: payload.payment?.id || payload.payment?.paymentId
        });
      }
    });
  };

  const isTutorSelf = user?.id === tutor.id;
  const isBookingDisabled = bookingMutation.isPending || !selectedSlotIndex || isTutorSelf;

  if (bookingResponse) {
    const booking = (bookingResponse as any)?.booking || (bookingResponse as any)?.data?.booking || bookingResponse;
    const bookingCode = booking?.bookingCode || booking?.id?.slice(-6)?.toUpperCase() || booking?.bookingId?.slice(-6)?.toUpperCase() || 'PENDING';
    const paymentId = booking?.paymentId;

    return (
      <>
        <Card className="sticky top-24 border-emerald-500/20 shadow-xl shadow-emerald-500/5 bg-background overflow-hidden animate-in fade-in zoom-in duration-300">
        <CardHeader className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-emerald-900">Booking Created!</h3>
              <p className="text-xs text-emerald-700 font-medium">Reference: #{bookingCode}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {!paymentId && (
              <div className="p-4 rounded-2xl bg-muted/50 border border-border/40 space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Payment Method</p>
                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <SelectTrigger className="rounded-xl border-border/40 font-medium bg-background">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="manual_bank_transfer">Manual Bank Transfer</SelectItem>
                    <SelectItem value="vnpay">VNPay</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl" 
              onClick={handlePay}
              disabled={paymentMutation.isPending}
            >
              {paymentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : bookingResponse.paymentId ? (
                'View Payment Details'
              ) : (
                'Continue to Payment'
              )}
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 h-10 text-xs font-bold rounded-xl" asChild>
                <Link href={ROUTES.STUDENT.SESSIONS}>View Sessions</Link>
              </Button>
              <Button variant="ghost" className="flex-1 h-10 text-xs font-bold rounded-xl" asChild>
                <Link href={ROUTES.STUDENT.DASHBOARD}>Dashboard</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {activePaymentData && (
        <PaymentInstructionModal
          isOpen={!!activePaymentData}
          onClose={() => setActivePaymentData(null)}
          instruction={activePaymentData.instruction}
          paymentId={activePaymentData.paymentId}
        />
      )}
    </>
    );
  }

  return (
    <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5 bg-background overflow-hidden">
      <CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
        <div className="flex items-baseline gap-1">
          <PriceDisplay amount={tutor.hourlyRate} size="xl" className="text-primary font-black" />
          <span className="text-sm text-muted-foreground font-medium">/ hour</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6 ">
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
              // Fallback: subject names only (UUIDs unavailable — booking will fail validation)
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
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Availability</label>
            <Select 
              value={selectedSlotIndex} 
              onValueChange={(val) => {
                setSelectedSlotIndex(val);
                setSelectedDate(undefined); // Reset date when slot changes
              }}
            >
              <SelectTrigger className="rounded-xl border-border/40 font-medium">
                <SelectValue placeholder="Select a slot" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {(tutor.availabilitySlots || []).map((slot, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    <span className="capitalize">{slot.dayOfWeek || slot.day}</span>: {slot.startTime} - {slot.endTime}
                  </SelectItem>
                ))}
                {(!tutor.availabilitySlots || tutor.availabilitySlots.length === 0) && (
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
                    if (date < today) return true; // prevent past dates
                    
                    if (selectedSlotIndex) {
                      const slot = tutor.availabilitySlots[parseInt(selectedSlotIndex, 10)];
                      if (slot) {
                        const dayName = slot.dayOfWeek || slot.day;
                        const targetDayNum = DAY_MAP[dayName.toLowerCase()];
                        if (targetDayNum !== undefined && date.getDay() !== targetDayNum) {
                          return true;
                        }
                      }
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
