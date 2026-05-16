'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { BookingFilterTabs, BookingStatusFilter } from './booking-filter-tabs';
import { BookingCard } from './booking-card';
import { useStudentBookingsQuery } from '../hooks/use-student-bookings-query';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/api/query-utils';
import { toast } from 'sonner';
import { CancelBookingModal } from './cancel-booking-modal';
import { Booking } from '../types';
import { useCreatePaymentMutation } from '@/features/payments/hooks/use-create-payment-mutation';
import { PaymentInstructionModal } from '@/features/payments/components/payment-instruction-modal';
import { PaymentInstruction } from '@/features/payments/types/index';

export function BookingListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = (searchParams.get('status') as BookingStatusFilter) || 'all';
  const page = searchParams.get('page') || '1';

  const limit = 20;
  const offset = (Number(page) - 1) * limit;

  const { data, isLoading, isError, error, refetch } = useStudentBookingsQuery({
    status,
    limit,
    offset,
  });

  const responseData = data as unknown as { items: Booking[]; pagination?: { total: number } };
  const bookings = responseData?.items || [];
  const total = responseData?.pagination?.total || 0;

  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [paymentInstruction, setPaymentInstruction] = useState<PaymentInstruction | null>(null);

  const { mutate: createPayment, isPending, variables } = useCreatePaymentMutation();

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load bookings', {
        description: getErrorMessage(error),
      });
    }
  }, [isError, error]);

  const handleStatusChange = (newStatus: BookingStatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    router.push(`?${params.toString()}`);
  };

  const handlePay = (bookingId: string) => {
    createPayment(bookingId, {
      onSuccess: (response) => {
        setPaymentInstruction(response.data.paymentInstruction);
      },
    });
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="My Bookings"
        description="Manage your lesson bookings and payments."
      />

      <BookingFilterTabs
        activeStatus={status}
        onStatusChange={handleStatusChange}
      />

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={bookings.length === 0}
        emptyTitle="No bookings found"
        emptyDescription="You don't have any bookings matching the selected filter."
        onRetry={() => refetch()}
      >
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              id={booking.bookingId}
              tutorName={(booking as any).tutorName || "Unknown Tutor"}
              subject={(booking as any).subjectName || "Unknown Subject"}
              date={new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

        <div className="bg-muted p-4 rounded-lg text-xs text-muted-foreground flex justify-between items-center">
          <span>Current Page: {page}</span>
          <span>
            Showing {bookings.length} of {total} total bookings
          </span>
        </div>
      </ListState>

      {bookingToCancel && (
        <CancelBookingModal
          isOpen={!!bookingToCancel}
          onClose={() => setBookingToCancel(null)}
          bookingId={bookingToCancel.bookingId}
          status={bookingToCancel.status}
          startTime={bookingToCancel.startTime}
        />
      )}

      {paymentInstruction && (
        <PaymentInstructionModal
          isOpen={!!paymentInstruction}
          onClose={() => setPaymentInstruction(null)}
          instruction={paymentInstruction}
        />
      )}
    </PageContainer>
  );
}
