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
import { Booking } from '@/features/bookings/types';
import { useCreatePaymentMutation } from '@/features/payments/hooks/use-create-payment-mutation';
import { useCreateBookingMutation } from '@/features/bookings/hooks/use-create-booking-mutation';
import { PaymentMethod } from '@/features/payments/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TutorBookingSummaryCardProps {
  tutor: Tutor;
}

export function TutorBookingSummaryCard({ tutor }: TutorBookingSummaryCardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || '');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('manual_bank_transfer');
  const [bookingResponse, setBookingResponse] = useState<Booking | null>(null);
  
  const bookingMutation = useCreateBookingMutation();
  const paymentMutation = useCreatePaymentMutation();

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
    }, {
      onSuccess: (data) => {
        setBookingResponse(data);
        // If payment method is selected, we could trigger payment creation here or show CTA
      }
    });
  };

  const handlePay = () => {
    // Case B: If paymentId already exists in booking response, redirect directly
    if (bookingResponse?.paymentId) {
      router.push(ROUTES.STUDENT.PAYMENT_DETAIL(bookingResponse.paymentId));
      return;
    }

    if (!bookingResponse?.bookingId) return;
    
    paymentMutation.mutate(bookingResponse.bookingId, {
      onSuccess: (response) => {
        router.push(ROUTES.STUDENT.PAYMENT_DETAIL(response.data.payment.paymentId));
      }
    });
  };

  const isTutorSelf = user?.id === tutor.id;
  const isBookingDisabled = bookingMutation.isPending || !selectedSlotIndex || isTutorSelf;

  if (bookingResponse) {
    return (
      <Card className="sticky top-24 border-emerald-500/20 shadow-xl shadow-emerald-500/5 bg-background overflow-hidden animate-in fade-in zoom-in duration-300">
        <CardHeader className="bg-emerald-500/5 p-6 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-emerald-900">Booking Created!</h3>
              <p className="text-xs text-emerald-700 font-medium">Reference: #{bookingResponse.bookingId.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            {!bookingResponse.paymentId && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-border/40 font-medium">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {(tutor.subjects || []).map(s => (
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
