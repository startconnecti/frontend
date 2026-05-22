'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useStudentBookingsQuery } from '@/features/bookings/hooks/use-student-bookings-query';
import { BookingCard } from '@/features/bookings/components/booking-card';
import { CancelBookingModal } from '@/features/bookings/components/cancel-booking-modal';
import { useCreatePaymentMutation } from '@/features/payments/hooks/use-create-payment-mutation';
import { PaymentInstructionModal } from '@/features/payments/components/payment-instruction-modal';
import { Booking } from '@/features/bookings/types';
import { PaymentInstruction } from '@/features/payments/types';
import { useAuthStore } from '@/stores/auth-store';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface TutorBookingsHistoryProps {
  tutorId: string;
  tutorName: string;
}

export function TutorBookingsHistory({ tutorId, tutorName }: TutorBookingsHistoryProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [activePaymentData, setActivePaymentData] = useState<{ instruction: PaymentInstruction; paymentId: string } | null>(null);

  const { mutate: createPayment, isPending, variables } = useCreatePaymentMutation();

  const { data, isLoading, isError } = useStudentBookingsQuery({
    tutorId,
    status: 'all',
    limit: 20,
    page: 1,
  });

  // Only render for authenticated students
  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  const bookings = data?.items || [];

  const handlePay = (bookingId: string) => {
    createPayment(bookingId, {
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
      },
    });
  };

  return (
    <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden mt-8">
      <CardHeader className="bg-muted/10 border-b border-border/40 p-6 flex flex-row items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-lg font-black text-brand-dark">Your Bookings with this Tutor</CardTitle>
          <p className="text-xs text-muted-foreground">Review and manage your learning schedule with {tutorName}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-sm text-rose-600 bg-rose-50/50 rounded-2xl border border-rose-100">
            Failed to load your booking history with this tutor.
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground bg-muted/5 rounded-2xl border border-dashed border-border/60">
            You don't have any bookings with {tutorName} yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                id={booking.bookingId}
                tutorName={tutorName}
                subject={(booking as any).subjectName || "Unknown Subject"}
                date={new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                time={`${new Date(booking.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date(booking.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                amount={`$${((booking as any).totalAmount ?? 0).toFixed(2)}`}
                status={booking.status}
                expiresAt={booking.expiresAt}
                onCancel={() => setBookingToCancel(booking)}
                onPay={() => handlePay(booking.bookingId)}
                isPaying={isPending && variables === booking.bookingId}
              />
            ))}
          </div>
        )}
      </CardContent>

      {bookingToCancel && (
        <CancelBookingModal
          isOpen={!!bookingToCancel}
          onClose={() => setBookingToCancel(null)}
          bookingId={bookingToCancel.bookingId}
          status={bookingToCancel.status}
          startTime={bookingToCancel.startTime}
        />
      )}

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
