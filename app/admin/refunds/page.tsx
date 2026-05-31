'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/pagination';
import { useAdminRefundsQuery, useApproveAdminRefund, useRejectAdminRefund } from '@/features/admin-refunds';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return 'N/A';
  try {
    const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
    return `${formattedAmount} ${currency || PLATFORM_CURRENCY}`;
  } catch {
    return `${amount} ${currency || PLATFORM_CURRENCY}`;
  }
}

function formatDate(dateString: string): string {
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

export default function RefundsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(1);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: refundsData, isLoading, isError } = useAdminRefundsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const { mutate: approveRefund, isPending: isApproving } = useApproveAdminRefund();
  const { mutate: rejectRefund, isPending: isRejecting } = useRejectAdminRefund();

  const statuses = ['all', 'pending', 'approved', 'rejected'] as const;

  const handleApprove = () => {
    if (!selectedRefundId) return;
    approveRefund(
      { id: selectedRefundId },
      {
        onSuccess: () => {
          toast({ title: 'Refund approved successfully' });
          setApproveModalOpen(false);
          setSelectedRefundId(null);
        },
        onError: (error: unknown) => {
          const msg = error instanceof Error ? error.message : 'An error occurred';
          toast({ title: 'Failed to approve refund', description: msg, variant: 'destructive' });
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedRefundId) return;
    if (!rejectReason.trim()) {
      toast({ title: 'Reason is required', variant: 'destructive' });
      return;
    }
    rejectRefund(
      { id: selectedRefundId, reason: rejectReason },
      {
        onSuccess: () => {
          toast({ title: 'Refund rejected successfully' });
          setRejectModalOpen(false);
          setSelectedRefundId(null);
          setRejectReason('');
        },
        onError: (error: unknown) => {
          const msg = error instanceof Error ? error.message : 'An error occurred';
          toast({ title: 'Failed to reject refund', description: msg, variant: 'destructive' });
        },
      }
    );
  };

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !refundsData) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-destructive">
            Error loading refunds
          </TableCell>
        </TableRow>
      );
    }

    if (refundsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
            No refunds found
          </TableCell>
        </TableRow>
      );
    }

    return refundsData.items.map((refund) => (
      <TableRow key={refund.id}>
        <TableCell className="font-mono text-sm">{refund.refundCode}</TableCell>
        <TableCell className="font-medium">{refund.studentName}</TableCell>
        <TableCell className="font-mono text-sm">{refund.bookingCode}</TableCell>
        <TableCell className="font-medium">{formatCurrency(refund.amount, PLATFORM_CURRENCY)}</TableCell>
        <TableCell>
          <AdminStatusBadge type="refund" status={refund.status} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(refund.createdAt)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(ADMIN_ROUTES.REFUND_DETAIL(refund.id))}
              title="View Detail"
            >
              <Eye className="w-4 h-4" />
            </Button>
            {refund.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setSelectedRefundId(refund.id);
                    setApproveModalOpen(true);
                  }}
                  title="Approve"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedRefundId(refund.id);
                    setRejectReason('');
                    setRejectModalOpen(true);
                  }}
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader title="Refunds Management" description="Review and process refund requests operationally." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search refund code, payment code, booking code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund Code</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Booking Code</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && refundsData && refundsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {refundsData.page} of {refundsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(refundsData.totalPages, page + 1))}
                disabled={page === refundsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this refund?
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
