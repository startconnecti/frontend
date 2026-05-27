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
  tutorId?: string;
  status: BookingStatus;
  startTime: string; // ISO string
}

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  tutorId,
  status,
  startTime,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: cancelBooking, isPending } = useCancelBookingMutation();

  const handleConfirm = () => {
    cancelBooking(
      { bookingId, payload: { cancellation_reason: reason }, tutorId },
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
