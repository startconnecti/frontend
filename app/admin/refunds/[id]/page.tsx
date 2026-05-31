'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAdminRefundDetailQuery, useApproveAdminRefund, useRejectAdminRefund } from '@/features/admin-refunds';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return 'N/A';
  try {
    const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
    return `${formattedAmount} ${currency || PLATFORM_CURRENCY}`;
  } catch {
    return `${amount} ${currency || PLATFORM_CURRENCY}`;
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
      return '-';
    }
    return date.toLocaleString();
  } catch {
    return '-';
  }
}

export default function RefundDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const { data: refund, isLoading, isError } = useAdminRefundDetailQuery(params.id);
  const { mutate: approveRefund, isPending: isApproving } = useApproveAdminRefund();
  const { mutate: rejectRefund, isPending: isRejecting } = useRejectAdminRefund();

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    approveRefund(
      { id: params.id },
      {
        onSuccess: () => {
          toast({ title: 'Refund approved successfully' });
          setApproveModalOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Failed to approve refund',
            description: error.response?.data?.message || 'An error occurred',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({ title: 'Reason is required', variant: 'destructive' });
      return;
    }
    rejectRefund(
      { id: params.id, reason: rejectReason },
      {
        onSuccess: () => {
          toast({ title: 'Refund rejected successfully' });
          setRejectModalOpen(false);
          setRejectReason('');
        },
        onError: (error: any) => {
          toast({
            title: 'Failed to reject refund',
            description: error.response?.data?.message || 'An error occurred',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !refund) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-destructive mb-4">Error loading refund details or refund not found.</p>
        <Button variant="outline" onClick={() => router.push('/admin/refunds')}>
          Back to Refunds
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 text-muted-foreground hover:text-foreground" 
        onClick={() => router.push('/admin/refunds')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Refunds
      </Button>

      <AdminPageHeader 
        title={`Refund Detail: ${refund.refundCode}`} 
        description="Operational view of refund details."
      >
        {refund.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setApproveModalOpen(true)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectModalOpen(true)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Refund Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground text-sm">Refund Code</span>
              <span className="font-mono text-sm">{refund.refundCode}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground text-sm">Status</span>
              <AdminStatusBadge type="refund" status={refund.status} />
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground text-sm">Amount</span>
              <span className="font-medium text-lg text-primary">{formatCurrency(refund.amount, PLATFORM_CURRENCY)}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground text-sm">Requested At</span>
              <span className="text-sm">{formatDate(refund.createdAt)}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground text-sm">Reason</span>
              <span className="text-sm bg-accent p-2 rounded-md">{refund.reason || 'No reason provided'}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student & Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground text-sm">Student Name</span>
                <span className="font-medium text-sm">{refund.student.fullName}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground text-sm">Student ID</span>
                <span className="font-mono text-xs text-muted-foreground">{refund.student.id}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground text-sm">Booking Code</span>
                <span className="font-mono text-sm">{refund.booking.bookingCode}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground text-sm">Payment Code</span>
                <span className="font-mono text-sm">{refund.payment.paymentCode}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {refund.approvedAt && (
                <div className="flex justify-between text-blue-600">
                  <span>Approved At:</span>
                  <span>{formatDate(refund.approvedAt)}</span>
                </div>
              )}
              {refund.rejectedAt && (
                <div className="flex justify-between text-red-600">
                  <span>Rejected At:</span>
                  <span>{formatDate(refund.rejectedAt)}</span>
                </div>
              )}
              {refund.processingAt && (
                <div className="flex justify-between text-purple-600">
                  <span>Processing At:</span>
                  <span>{formatDate(refund.processingAt)}</span>
                </div>
              )}
              {refund.refundedAt && (
                <div className="flex justify-between text-green-600">
                  <span>Refunded At:</span>
                  <span>{formatDate(refund.refundedAt)}</span>
                </div>
              )}
              {refund.failedAt && (
                <div className="flex justify-between text-gray-600">
                  <span>Failed At:</span>
                  <span>{formatDate(refund.failedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this refund for {formatCurrency(refund.amount, PLATFORM_CURRENCY)}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? 'Approving...' : 'Confirm Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Refund</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this refund request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
