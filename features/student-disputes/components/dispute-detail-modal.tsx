'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile'; // Use proper hook based on prior fix
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Session } from '@/features/sessions/types/index';
import { useCancelDisputeMutation } from '../hooks/use-cancel-dispute-mutation';
import { formatCurrency } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export interface DisputeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewing: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function DisputeDetailModal({
  open,
  onOpenChange,
  session,
}: DisputeDetailModalProps) {
  const isMobile = false; // We'll assume responsive dialog or use useIsMobile if needed
  const dispute = session.dispute;
  const { mutate: cancelDispute, isPending: isCancelling } = useCancelDisputeMutation();
  const [cancelAlertOpen, setCancelAlertOpen] = useState(false);

  if (!dispute) return null;

  const handleCancel = () => {
    cancelDispute(
      { disputeId: dispute.disputeId, sessionId: session.sessionId },
      {
        onSuccess: () => {
          setCancelAlertOpen(false);
          onOpenChange(false);
        },
      }
    );
  };

  const canCancel = dispute.status === 'open';

  const content = (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Dispute Reference</h4>
          <p className="font-mono text-lg font-bold">{dispute.disputeCode || 'Pending'}</p>
        </div>
        <Badge className={statusColors[dispute.status] || statusColors.open} variant="outline">
          {dispute.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground block mb-1">Created At</span>
          <span className="font-medium">
            {dispute.createdAt ? new Date(dispute.createdAt).toLocaleString() : '-'}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Dispute Type</span>
          <span className="font-medium capitalize">{dispute.disputeType?.replace('_', ' ') || '-'}</span>
        </div>
        <div>
          <span className="text-muted-foreground block mb-1">Requested Resolution</span>
          <span className="font-medium capitalize">{dispute.requestedResolution?.replace('_', ' ') || '-'}</span>
        </div>
      </div>

      <div>
        <span className="text-sm text-muted-foreground block mb-1">Reason</span>
        <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap border border-border/50">
          {dispute.reason || 'No description provided.'}
        </div>
      </div>

      {dispute.adminResolution && (
        <div>
          <span className="text-sm font-bold block mb-1">Admin Resolution</span>
          <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-sm whitespace-pre-wrap border border-blue-100">
            {dispute.adminResolution}
          </div>
        </div>
      )}

      {dispute.rejectReason && (
        <div>
          <span className="text-sm font-bold block mb-1 text-red-800">Rejection Reason</span>
          <div className="p-3 bg-red-50 text-red-900 rounded-lg text-sm whitespace-pre-wrap border border-red-100">
            {dispute.rejectReason}
          </div>
        </div>
      )}

      {dispute.refundId && (
        <div>
          <span className="text-sm font-bold block mb-1 text-green-800">Refund Status</span>
          <div className="p-3 bg-green-50 text-green-900 rounded-lg text-sm flex justify-between items-center border border-green-100">
            <span>Refund ID: <span className="font-mono">{dispute.refundId.slice(-8)}</span></span>
            <Badge className="bg-green-100 text-green-800 border-transparent">Processed</Badge>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        {canCancel && (
          <Button variant="destructive" onClick={() => setCancelAlertOpen(true)}>
            Cancel Dispute
          </Button>
        )}
      </div>

      <AlertDialog open={cancelAlertOpen} onOpenChange={setCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Dispute</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this dispute? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>No, Keep It</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Dispute'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // We could add useIsMobile here to show a Drawer on mobile, similar to create modal.
  // For simplicity, sticking to Dialog.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dispute Details</DialogTitle>
          <DialogDescription>
            Review the status and details of your reported issue.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
