'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PAGINATION } from '@/constants/pagination';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminDisputesQuery,
  useAdminMarkReviewingMutation,
  useAdminRejectDisputeMutation,
  type AdminDisputeStatus,
} from '@/features/admin-disputes';

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '-';
  }
}

function truncateId(id: string | null | undefined): string {
  if (!id) return '-';
  if (id.length <= 8) return id;
  return `${id.substring(0, 8)}…`;
}

// ─── Status tabs ─────────────────────────────────────────────────────────────

type StatusFilter = 'all' | AdminDisputeStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Closed', value: 'closed' },
];

// ─── Action visibility ────────────────────────────────────────────────────────

function getDisputeActions(status: AdminDisputeStatus) {
  return {
    canStartReview: status === 'open' || status === 'pending',
    canReject: status === 'open' || status === 'pending' || status === 'reviewing',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

type ActiveDialog = 'review' | 'reject' | null;

export default function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const [actionDisputeId, setActionDisputeId] = useState<string | null>(null);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [rejectReason, setRejectReason] = useState('');

  const markReviewingMutation = useAdminMarkReviewingMutation();
  const rejectMutation = useAdminRejectDisputeMutation();

  const { data: disputesData, isLoading, isError } = useAdminDisputesQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const openCount = disputesData?.items.filter(d => d.status === 'open' || d.status === 'pending').length ?? 0;

  function openDialog(disputeId: string, dialog: ActiveDialog) {
    setActionDisputeId(disputeId);
    setActiveDialog(dialog);
    setRejectReason('');
  }

  function closeDialog() {
    setActionDisputeId(null);
    setActiveDialog(null);
    setRejectReason('');
  }

  function handleStartReview() {
    if (!actionDisputeId) return;
    markReviewingMutation.mutate({ disputeId: actionDisputeId }, { onSuccess: closeDialog });
  }

  function handleReject() {
    if (!actionDisputeId) return;
    rejectMutation.mutate(
      { disputeId: actionDisputeId, reason: rejectReason.trim() || undefined },
      { onSuccess: closeDialog },
    );
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

    if (isError || !disputesData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading disputes
          </TableCell>
        </TableRow>
      );
    }

    if (disputesData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No disputes found
          </TableCell>
        </TableRow>
      );
    }

    return disputesData.items.map(dispute => {
      const { canStartReview, canReject } = getDisputeActions(dispute.status);

      return (
        <TableRow key={dispute.id}>
          {/* Dispute column */}
          <TableCell>
            <p className="font-mono text-sm font-medium">{dispute.disputeCode}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {truncateId(dispute.id)}
            </p>
          </TableCell>

          {/* Student column */}
          <TableCell>
            <p className="text-sm font-medium">{dispute.studentName}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {truncateId(dispute.studentId)}
            </p>
          </TableCell>

          {/* Tutor column */}
          <TableCell>
            <p className="text-sm font-medium">{dispute.tutorName}</p>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              {truncateId(dispute.tutorProfileId)}
            </p>
          </TableCell>

          {/* Status column */}
          <TableCell>
            <AdminStatusBadge status={dispute.status} type="dispute" />
          </TableCell>

          {/* Created column */}
          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDate(dispute.createdAt)}
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
                <Link href={ADMIN_ROUTES.DISPUTE_DETAIL(dispute.id)}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                </Link>
                {canStartReview && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => openDialog(dispute.id, 'review')}
                  >
                    <Search className="mr-2 h-4 w-4 text-blue-600" /> Start Review
                  </DropdownMenuItem>
                )}
                {canReject && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => openDialog(dispute.id, 'reject')}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
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
        title="Disputes"
        description="Review and resolve dispute requests from students and tutors."
      />

      {openCount > 0 && (
        <Card className="mb-6 border-l-4 border-l-destructive bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Action Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {openCount} dispute{openCount !== 1 ? 's' : ''} awaiting review.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search by dispute code, student, or tutor..."
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
                <TableHead>Dispute</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && disputesData && disputesData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {disputesData.page} of {disputesData.totalPages}
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
                onClick={() => setPage(p => Math.min(disputesData.totalPages, p + 1))}
                disabled={page === disputesData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Start Review Dialog */}
      <AlertDialog open={activeDialog === 'review'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Review</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this dispute as under review. You will be able to resolve or reject it afterward.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); handleStartReview(); }}
              disabled={markReviewingMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Start Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={activeDialog === 'reject'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Dispute</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason for rejecting this dispute. This will be recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-0 pb-2">
            <Label htmlFor="reject-reason-list" className="text-sm font-medium">
              Reason <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="reject-reason-list"
              className="mt-2"
              rows={3}
              placeholder="Explain why this dispute is being rejected..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); handleReject(); }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={rejectMutation.isPending}
            >
              Reject Dispute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
