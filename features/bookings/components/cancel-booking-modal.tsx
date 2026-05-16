'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookingStatus } from '../types';
import { useCancelBookingMutation } from '../hooks/use-cancel-booking-mutation';
import { Loader2 } from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  status: BookingStatus;
  startTime: string; // ISO string
}

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  status,
  startTime,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: cancelBooking, isPending } = useCancelBookingMutation();

  const calculateRefundPolicy = () => {
    if (status !== 'confirmed') return null;

    const now = new Date();
    const start = new Date(startTime);
    const hoursDiff = (start.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return 'You are eligible for a 100% refund as the session starts in more than 24 hours.';
    } else if (hoursDiff >= 12) {
      return 'You are eligible for a 50% refund as the session starts in 12-24 hours.';
    } else {
      return 'You are not eligible for a refund as the session starts in less than 12 hours.';
    }
  };

  const refundWarning = calculateRefundPolicy();

  const handleConfirm = () => {
    cancelBooking(
      { bookingId, payload: { cancellation_reason: reason } },
      {
        onSuccess: () => {
          onClose();
          setReason('');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Cancel Booking</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {refundWarning && (
          <div className="bg-destructive/10 p-4 rounded-lg text-sm font-medium text-destructive">
            <strong>Refund Policy Warning:</strong> {refundWarning}
          </div>
        )}

        <div className="space-y-2 mt-4">
          <label htmlFor="reason" className="text-sm font-medium">
            Reason for cancellation (optional)
          </label>
          <Textarea
            id="reason"
            placeholder="Please let us know why you are cancelling..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            className="h-24"
          />
          <div className="text-xs text-muted-foreground text-right">
            {reason.length}/500 characters
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
