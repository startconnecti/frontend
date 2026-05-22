import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCancelBookingMutation } from '../hooks/use-admin-booking-actions';

interface CancelBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  warningMessage?: string | null;
}

export function CancelBookingDialog({
  isOpen,
  onClose,
  bookingId,
  warningMessage
}: CancelBookingDialogProps) {
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const cancelMutation = useCancelBookingMutation();

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      setCancelReasonError('Reason is required');
      return;
    }
    if (cancelReason.length > 1000) {
      setCancelReasonError('Reason must be less than 1000 characters');
      return;
    }
    setCancelReasonError('');
    if (bookingId) {
      cancelMutation.mutate(
        { id: bookingId, reason: cancelReason.trim() },
        {
          onSuccess: () => {
            setCancelReason('');
            onClose();
          }
        }
      );
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCancelReason('');
      setCancelReasonError('');
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-muted-foreground mt-2">
                This action cannot be undone. It will permanently cancel the booking, release the tutor&apos;s time slot for other students, and mark the associated session/payment as cancelled.
              </p>
              
              {warningMessage && (
                <Alert className="border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 stroke-amber-600 dark:stroke-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Warning</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-200">
                    {warningMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-muted-foreground">
                Please provide a reason for cancellation below.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-2">
          <label htmlFor="cancel-reason" className="text-sm font-medium mb-2 block">
            Reason for Cancellation <span className="text-destructive">*</span>
          </label>
          <Textarea 
            id="cancel-reason"
            placeholder="E.g., Requested by user, tutor unavailable..."
            value={cancelReason}
            onChange={(e) => {
              setCancelReason(e.target.value);
              if (cancelReasonError) setCancelReasonError('');
            }}
            className="resize-none"
            rows={3}
          />
          {cancelReasonError && (
            <p className="text-destructive text-xs mt-2">{cancelReasonError}</p>
          )}
          <p className="text-muted-foreground text-xs mt-2 text-right">
            {cancelReason.length} / 1000
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => { e.preventDefault(); handleCancel(); }}
            className="bg-destructive hover:bg-destructive/90"
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Canceling...
              </>
            ) : (
              'Yes, cancel booking'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
