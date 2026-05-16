'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCancelSessionMutation } from '../hooks/use-cancel-session-mutation';
import { Loader2 } from 'lucide-react';

interface CancelSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

export function CancelSessionModal({
  isOpen,
  onClose,
  sessionId,
}: CancelSessionModalProps) {
  const [reason, setReason] = useState('');
  const { mutate: cancelSession, isPending } = useCancelSessionMutation();

  const handleConfirm = () => {
    cancelSession(
      { sessionId, payload: { cancellation_reason: reason } },
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
          <DialogTitle className="text-destructive">Cancel Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this session? This action cannot be undone.
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
