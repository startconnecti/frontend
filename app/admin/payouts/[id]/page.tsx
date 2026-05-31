'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminPayoutDetailQuery,
  useAdminApprovePayoutMutation,
  useAdminMarkPayoutProcessingMutation,
  useAdminMarkPayoutPaidMutation,
  useAdminCancelPayoutMutation,
  type AdminPayoutStatus,
} from '@/features/admin-payouts';

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '₫0';
  return `₫${new Intl.NumberFormat('vi-VN').format(Math.round(amount))}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

function formatDateShort(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '-';
  }
}

function getDurationDays(start: string | null | undefined, end: string | null | undefined): string {
  if (!start || !end) return '-';
  try {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    if (Number.isNaN(diff) || diff < 0) return '-';
    const days = Math.round(diff / 86400000);
    return `${days} day${days !== 1 ? 's' : ''}`;
  } catch {
    return '-';
  }
}

// ─── Status timeline ──────────────────────────────────────────────────────────

const TIMELINE_STEPS: { status: AdminPayoutStatus; label: string }[] = [
  { status: 'pending', label: 'Pending' },
  { status: 'approved', label: 'Approved' },
  { status: 'processing', label: 'Processing' },
  { status: 'paid', label: 'Paid' },
];

function getStatusOrder(status: AdminPayoutStatus): number {
  const map: Record<AdminPayoutStatus, number> = {
    pending: 0,
    approved: 1,
    processing: 2,
    paid: 3,
    failed: 2,
    cancelled: -1,
  };
  return map[status] ?? 0;
}

// ─── Action visibility ────────────────────────────────────────────────────────

function getPayoutActions(status: AdminPayoutStatus) {
  return {
    canApprove: status === 'pending',
    canMarkProcessing: status === 'approved',
    canMarkPaid: status === 'processing',
    canCancel: status === 'pending' || status === 'approved',
  };
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function PayoutDetailSkeleton() {
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ADMIN_ROUTES.PAYOUTS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="p-6"><Skeleton className="h-40 w-full" /></Card>
        </div>
      </div>
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PayoutDetailPage() {
  const params = useParams();
  const payoutId = params.id as string;

  const [activeDialog, setActiveDialog] = useState<'approve' | 'processing' | 'paid' | 'cancel' | null>(null);

  const approveMutation = useAdminApprovePayoutMutation();
  const markProcessingMutation = useAdminMarkPayoutProcessingMutation();
  const markPaidMutation = useAdminMarkPayoutPaidMutation();
  const cancelMutation = useAdminCancelPayoutMutation();

  const { data: apiResponse, isLoading, isError } = useAdminPayoutDetailQuery(payoutId);

  function closeDialog() {
    setActiveDialog(null);
  }

  if (isLoading) return <PayoutDetailSkeleton />;

  const payout = apiResponse?.payout;

  if (isError || !payout) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href={ADMIN_ROUTES.PAYOUTS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Payout Details</h1>
        </div>
        <AdminRecordNotFound href={ADMIN_ROUTES.PAYOUTS} />
      </>
    );
  }

  const displayCode = payout.payoutCode ?? payout.id.substring(0, 8).toUpperCase();
  const { canApprove, canMarkProcessing, canMarkPaid, canCancel } = getPayoutActions(payout.status);
  const statusOrder = getStatusOrder(payout.status);
  const isTerminal = payout.status === 'failed' || payout.status === 'cancelled';

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href={ADMIN_ROUTES.PAYOUTS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{displayCode}</h1>
            <AdminStatusBadge status={payout.status} type="payout" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canApprove && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setActiveDialog('approve')}
              disabled={approveMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Approve
            </Button>
          )}
          {canMarkProcessing && (
            <Button
              variant="outline"
              onClick={() => setActiveDialog('processing')}
              disabled={markProcessingMutation.isPending}
            >
              <Loader2 className="mr-2 h-4 w-4" /> Mark Processing
            </Button>
          )}
          {canMarkPaid && (
            <Button
              onClick={() => setActiveDialog('paid')}
              disabled={markPaidMutation.isPending}
            >
              <DollarSign className="mr-2 h-4 w-4" /> Mark Paid
            </Button>
          )}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => setActiveDialog('cancel')}
              disabled={cancelMutation.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tutor Information */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" /> Tutor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Tutor Name</p>
                <p className="text-sm font-medium mt-1">{payout.tutorName ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tutor Profile ID</p>
                <p className="font-mono text-sm mt-1 break-all">{payout.tutorProfileId || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Payout Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" /> Payout Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Gross Amount</p>
                <p className="text-xl font-bold mt-1">{formatVND(payout.grossAmount)}</p>
              </div>
              <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-center">
                <p className="text-xs text-destructive/70">Commission</p>
                <p className="text-xl font-bold text-destructive mt-1">
                  − {formatVND(payout.commissionAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                <p className="text-xs text-green-700">Net Amount</p>
                <p className="text-xl font-bold text-green-700 mt-1">{formatVND(payout.netAmount)}</p>
              </div>
            </div>
          </Card>

          {/* Payment Period */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" /> Payment Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Period Start</p>
                <p className="text-sm font-medium mt-1">{formatDateShort(payout.periodStart)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Period End</p>
                <p className="text-sm font-medium mt-1">{formatDateShort(payout.periodEnd)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium mt-1">
                  {getDurationDays(payout.periodStart, payout.periodEnd)}
                </p>
              </div>
            </div>
          </Card>

          {/* Workflow Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Status Timeline
            </h3>
            {isTerminal ? (
              <div className={`rounded-lg p-4 border ${payout.status === 'failed' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/40'}`}>
                <p className="font-semibold capitalize">{payout.status}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This payout was {payout.status}.
                </p>
              </div>
            ) : (
              <ol className="relative border-l border-border ml-3 space-y-6">
                {TIMELINE_STEPS.map(step => {
                  const stepOrder = getStatusOrder(step.status);
                  const isDone = stepOrder < statusOrder;
                  const isCurrent = step.status === payout.status;

                  let dotClass = 'bg-muted border-border';
                  if (isCurrent) dotClass = 'bg-primary border-primary';
                  else if (isDone) dotClass = 'bg-green-500 border-green-500';

                  let textClass = 'text-muted-foreground';
                  if (isCurrent) textClass = 'text-foreground font-semibold';
                  else if (isDone) textClass = 'text-green-700';

                  return (
                    <li key={step.status} className="ml-6">
                      <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${dotClass}`}>
                        {isDone && <CheckCircle className="h-3 w-3 text-white" />}
                      </span>
                      <p className={`text-sm ${textClass}`}>{step.label}</p>
                      {step.status === 'approved' && payout.approvedAt && (
                        <p className="text-xs text-muted-foreground">{formatDate(payout.approvedAt)}</p>
                      )}
                      {step.status === 'paid' && payout.paidAt && (
                        <p className="text-xs text-muted-foreground">{formatDate(payout.paidAt)}</p>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Raw Info */}
          <Card className="p-6 bg-muted/50">
            <h4 className="text-sm font-bold text-foreground mb-4">Raw Information</h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground">Payout ID</p>
                <p className="font-mono break-all mt-0.5">{payout.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tutor Profile ID</p>
                <p className="font-mono break-all mt-0.5">{payout.tutorProfileId || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium mt-0.5">{formatDate(payout.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium mt-0.5">{formatDate(payout.updatedAt)}</p>
              </div>
              {payout.approvedAt && (
                <div>
                  <p className="text-muted-foreground">Approved At</p>
                  <p className="font-medium mt-0.5">{formatDate(payout.approvedAt)}</p>
                </div>
              )}
              {payout.paidAt && (
                <div>
                  <p className="text-muted-foreground">Paid At</p>
                  <p className="font-medium mt-0.5">{formatDate(payout.paidAt)}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Approve Dialog ── */}
      <AlertDialog open={activeDialog === 'approve'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you want to approve this payout ({displayCode}). The tutor will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); approveMutation.mutate({ payoutId }, { onSuccess: closeDialog }); }}
              className="bg-green-600 hover:bg-green-700"
              disabled={approveMutation.isPending}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Mark Processing Dialog ── */}
      <AlertDialog open={activeDialog === 'processing'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Processing</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you want to mark {displayCode} as processing. This indicates payment has been initiated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); markProcessingMutation.mutate({ payoutId }, { onSuccess: closeDialog }); }}
              disabled={markProcessingMutation.isPending}
            >
              Mark Processing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Mark Paid Dialog ── */}
      <AlertDialog open={activeDialog === 'paid'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Paid</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm you want to mark {displayCode} as paid. This finalizes the payout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); markPaidMutation.mutate({ payoutId }, { onSuccess: closeDialog }); }}
              disabled={markPaidMutation.isPending}
            >
              Mark Paid
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Cancel Dialog ── */}
      <AlertDialog open={activeDialog === 'cancel'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel {displayCode}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); cancelMutation.mutate({ payoutId }, { onSuccess: closeDialog }); }}
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
