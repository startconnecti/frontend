import { useState } from 'react';
import { useRejectChangeRequestMutation } from '../hooks/use-admin-change-requests';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface RejectionDialogProps {
  requestId: string;
  trigger: React.ReactNode;
}

export function RejectionDialog({ requestId, trigger }: RejectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const rejectMutation = useRejectChangeRequestMutation();

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    
    try {
      await rejectMutation.mutateAsync({ id: requestId, reason });
      toast.success('Change request rejected successfully');
      setOpen(false);
      setReason('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject change request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Change Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this tutor profile change request? The tutor will be notified, and they will need to submit a new request if they want to make changes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="rejection-reason" className="text-sm font-medium mb-2 block text-destructive">
            Rejection Reason (Required) *
          </label>
          <Textarea
            id="rejection-reason"
            placeholder="Please provide a clear reason for the rejection so the tutor knows what to fix..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={rejectMutation.isPending}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={rejectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={rejectMutation.isPending || !reason.trim()}
            variant="destructive"
          >
            {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
