'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PAGINATION } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminPayoutsQuery,
  useAdminApprovePayoutMutation,
  useAdminMarkPayoutProcessingMutation,
  useAdminCancelPayoutMutation,
  type AdminPayoutStatus,
} from '@/features/admin-payouts';

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  if (Number.isNaN(amount)) return '₫0';
  return `₫${new Intl.NumberFormat('vi-VN').format(Math.round(amount))}`;
}

function formatPeriodDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '-';
  }
}

function formatCreatedAt(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '-';
  }
}

function truncateId(id: string): string {
  if (!id || id.length <= 8) return id || '-';
  return `${id.substring(0, 8)}…`;
}

// ─── Status filter tabs ───────────────────────────────────────────────────────

type StatusFilter = 'all' | AdminPayoutStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Processing', value: 'processing' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ─── Action visibility ────────────────────────────────────────────────────────

function getPayoutActions(status: AdminPayoutStatus) {
  return {
    canApprove: status === 'pending',
    canMarkProcessing: status === 'approved',
    canCancel: status === 'pending' || status === 'approved',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const [actionPayoutId, setActionPayoutId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<'approve' | 'processing' | 'cancel' | null>(null);

  const approveMutation = useAdminApprovePayoutMutation();
  const markProcessingMutation = useAdminMarkPayoutProcessingMutation();
  const cancelMutation = useAdminCancelPayoutMutation();

  const { data: payoutsData, isLoading, isError } = useAdminPayoutsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  function openDialog(payoutId: string, dialog: 'approve' | 'processing' | 'cancel') {
    setActionPayoutId(payoutId);
    setActiveDialog(dialog);
  }

  function closeDialog() {
    setActionPayoutId(null);
    setActiveDialog(null);
  }

  function handleApprove() {
    if (!actionPayoutId) return;
    approveMutation.mutate({ payoutId: actionPayoutId }, { onSuccess: closeDialog });
  }

  function handleMarkProcessing() {
    if (!actionPayoutId) return;
    markProcessingMutation.mutate({ payoutId: actionPayoutId }, { onSuccess: closeDialog });
  }

  function handleCancel() {
    if (!actionPayoutId) return;
    cancelMutation.mutate({ payoutId: actionPayoutId }, { onSuccess: closeDialog });
  }

  const renderRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
          ))}
        </TableRow>
      ));
    }

    if (isError || !payoutsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading payouts
          </TableCell>
        </TableRow>
      );
    }

    if (payoutsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No payouts found
          </TableCell>
        </TableRow>
      );
    }

    return payoutsData.items.map(payout => {
      const { canApprove, canMarkProcessing, canCancel } = getPayoutActions(payout.status);

      return (
        <TableRow key={payout.id}>
          {/* Payout column */}
          <TableCell>
            <p className="font-mono text-sm font-medium">{payout.payoutCode}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Created {formatCreatedAt(payout.createdAt)}
            </p>
          </TableCell>

          {/* Tutor column */}
          <TableCell>
            <p className="text-sm font-medium">{payout.tutorName}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {truncateId(payout.tutorProfileId)}
            </p>
          </TableCell>

          {/* Period column */}
          <TableCell className="text-sm whitespace-nowrap">
            {formatPeriodDate(payout.periodStart)} → {formatPeriodDate(payout.periodEnd)}
          </TableCell>

          {/* Net Amount column */}
          <TableCell>
            <p className="font-semibold">{formatVND(payout.netAmount)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gross: {formatVND(payout.grossAmount)}
            </p>
            <p className="text-xs text-muted-foreground">
              Commission: {formatVND(payout.commissionAmount)}
            </p>
          </TableCell>

          {/* Status column */}
          <TableCell>
            <AdminStatusBadge status={payout.status} type="payout" />
          </TableCell>

          {/* Actions column */}
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={ADMIN_ROUTES.PAYOUT_DETAIL(payout.id)}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                </Link>
                {canApprove && (
                  <DropdownMenuItem
                    className="cursor-pointer text-green-700"
                    onClick={() => openDialog(payout.id, 'approve')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                )}
                {canMarkProcessing && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openDialog(payout.id, 'processing')}
                  >
                    <Loader2 className="mr-2 h-4 w-4" /> Mark Processing
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => openDialog(payout.id, 'cancel')}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <AdminPageHeader
        title="Payouts"
        description="Manage tutor payout requests and workflow."
      />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search by payout code..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(tab => (
              <Button
                key={tab.value}
                variant={statusFilter === tab.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && payoutsData && payoutsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {payoutsData.page} of {payoutsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(payoutsData.totalPages, p + 1))}
                disabled={page === payoutsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={activeDialog === 'approve'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you want to approve this payout. The tutor will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); handleApprove(); }}
              className="bg-green-600 hover:bg-green-600/90"
              disabled={approveMutation.isPending}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark Processing Dialog */}
      <AlertDialog open={activeDialog === 'processing'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Processing</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you want to mark this payout as processing. This indicates payment has been initiated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); handleMarkProcessing(); }}
              disabled={markProcessingMutation.isPending}
            >
              Mark Processing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={activeDialog === 'cancel'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this payout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); handleCancel(); }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              Cancel Payout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
