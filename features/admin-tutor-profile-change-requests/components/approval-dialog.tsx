import { useState } from 'react';
import { useApproveChangeRequestMutation } from '../hooks/use-admin-change-requests';
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

interface ApprovalDialogProps {
  requestId: string;
  trigger: React.ReactNode;
}

export function ApprovalDialog({ requestId, trigger }: ApprovalDialogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const approveMutation = useApproveChangeRequestMutation();

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ id: requestId, note });
      toast.success('Change request approved successfully');
      setOpen(false);
      setNote('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve change request');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Change Request</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this tutor profile change request? The requested changes will be immediately applied to the tutor's public profile.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="approval-note" className="text-sm font-medium mb-2 block">
            Review Note (Optional)
          </label>
          <Textarea
            id="approval-note"
            placeholder="Add an optional note about this approval..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={approveMutation.isPending}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={approveMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {approveMutation.isPending ? 'Approving...' : 'Confirm Approval'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
