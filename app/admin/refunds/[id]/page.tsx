'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  useAdminRefundDetailQuery,
  useApproveAdminRefund,
  useRejectAdminRefund,
} from '@/features/admin-refunds';
import { PLATFORM_CURRENCY } from '@/lib/constants/currency';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import type { AdminRefundDetail, AdminRefundStatus } from '@/features/admin-refunds/types';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  CreditCard,
  BookOpen,
  Banknote,
  AlertCircle,
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return '–';
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} ${PLATFORM_CURRENCY}`;
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '–';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime()) || d.getFullYear() === 1970) return '–';
    return d.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return '–';
  }
}

// ─── timeline ─────────────────────────────────────────────────────────────────

type TimelineStage = {
  key: string;
  label: string;
  timestampField: keyof AdminRefundDetail | null;
  noteField?: keyof AdminRefundDetail | null;
  color: string;
  activeColor: string;
  doneColor: string;
};

const NORMAL_STAGES: TimelineStage[] = [
  {
    key: 'created',
    label: 'Created',
    timestampField: 'createdAt',
    noteField: null,
    color: 'border-slate-300',
    activeColor: 'bg-yellow-500 border-yellow-500',
    doneColor: 'bg-green-500 border-green-500',
  },
  {
    key: 'approved',
    label: 'Approved',
    timestampField: 'approvedAt',
    noteField: 'approvalNote',
    color: 'border-slate-300',
    activeColor: 'bg-blue-500 border-blue-500',
    doneColor: 'bg-green-500 border-green-500',
  },
  {
    key: 'processing',
    label: 'Processing',
    timestampField: 'processingAt',
    noteField: 'processingNote',
    color: 'border-slate-300',
    activeColor: 'bg-purple-500 border-purple-500',
    doneColor: 'bg-green-500 border-green-500',
  },
  {
    key: 'refunded',
    label: 'Refunded',
    timestampField: 'refundedAt',
    noteField: 'refundNote',
    color: 'border-slate-300',
    activeColor: 'bg-green-500 border-green-500',
    doneColor: 'bg-green-500 border-green-500',
  },
];

function getStageState(
  stageKey: string,
  status: AdminRefundStatus
): 'done' | 'active' | 'pending' {
  const order = ['created', 'approved', 'processing', 'refunded'];
  const statusToStage: Record<string, string> = {
    pending: 'created',
    approved: 'approved',
    processing: 'processing',
    refunded: 'refunded',
  };
  const currentStage = statusToStage[status] ?? 'created';
  const currentIndex = order.indexOf(currentStage);
  const stageIndex = order.indexOf(stageKey);

  if (stageIndex < currentIndex) return 'done';
  if (stageIndex === currentIndex) return 'active';
  return 'pending';
}

interface TimelineProps {
  refund: AdminRefundDetail;
}

function RefundTimeline({ refund }: TimelineProps) {
  const isRejected = refund.status === 'rejected';
  const isFailed = refund.status === 'failed';
  const isCancelled = refund.status === 'cancelled';
  const isTerminal = isRejected || isFailed || isCancelled;

  return (
    <div className="relative">
      {/* Normal flow */}
      <ol className="relative">
        {NORMAL_STAGES.map((stage, idx) => {
          const state = isTerminal ? (idx === 0 ? 'done' : 'pending') : getStageState(stage.key, refund.status);
          const timestamp = stage.timestampField ? (refund[stage.timestampField] as string | null) : null;
          const note = stage.noteField ? (refund[stage.noteField] as string | null) : null;
          const isLast = idx === NORMAL_STAGES.length - 1;

          return (
            <li key={stage.key} className={`relative ${!isLast ? 'pb-8' : ''}`}>
              {/* connector line */}
              {!isLast && (
                <div
                  className={`absolute left-3.5 top-7 h-full w-px ${state === 'done' ? 'bg-green-300' : 'bg-border'}`}
                />
              )}

              <div className="flex items-start gap-4">
                {/* circle */}
                <div
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-white transition-colors ${
                    state === 'done'
                      ? stage.doneColor
                      : state === 'active'
                      ? stage.activeColor
                      : 'border-border bg-background'
                  }`}
                >
                  {state === 'done' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : state === 'active' ? (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  ) : (
                    <div className="h-2.5 w-2.5 rounded-full border border-border" />
                  )}
                </div>

                {/* content */}
                <div className="min-w-0 flex-1 pb-1">
                  <p
                    className={`text-sm font-semibold leading-none ${
                      state === 'done'
                        ? 'text-green-700'
                        : state === 'active'
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {stage.label}
                  </p>
                  {timestamp && formatDate(timestamp) !== '–' && (
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(timestamp)}</p>
                  )}
                  {note && (
                    <p className="mt-1.5 rounded-md bg-accent px-2 py-1.5 text-xs text-accent-foreground">
                      {note}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Terminal states */}
      {isRejected && (
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-red-500 text-white">
            <XCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-600">Rejected</p>
            {refund.rejectedAt && formatDate(refund.rejectedAt) !== '–' && (
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(refund.rejectedAt)}</p>
            )}
            {refund.rejectReason && (
              <p className="mt-1.5 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-800">
                {refund.rejectReason}
              </p>
            )}
          </div>
        </div>
      )}
      {isFailed && (
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-red-500 bg-red-500 text-white">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-red-600">Failed</p>
            {refund.failedAt && formatDate(refund.failedAt) !== '–' && (
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(refund.failedAt)}</p>
            )}
            {refund.failedReason && (
              <p className="mt-1.5 rounded-md bg-red-50 px-2 py-1.5 text-xs text-red-800">
                {refund.failedReason}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── field row ────────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  mono = false,
  valueClassName,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3 last:border-b-0">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-right text-sm ${mono ? 'font-mono' : 'font-medium'} ${valueClassName ?? ''}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── loading skeleton ─────────────────────────────────────────────────────────

function RefundDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function RefundDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const {
    data: refund,
    isLoading,
    isError,
    refetch,
  } = useAdminRefundDetailQuery(id);

  const { mutate: approveRefund, isPending: isApproving } = useApproveAdminRefund();
  const { mutate: rejectRefund, isPending: isRejecting } = useRejectAdminRefund();

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    approveRefund(
      { id },
      {
        onSuccess: () => {
          toast({ title: 'Refund approved successfully.' });
          setApproveModalOpen(false);
        },
        onError: (error: unknown) => {
          const msg =
            error instanceof Error ? error.message : 'An error occurred';
          toast({ title: 'Failed to approve refund', description: msg, variant: 'destructive' });
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
      { id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          toast({ title: 'Refund rejected.' });
          setRejectModalOpen(false);
          setRejectReason('');
        },
        onError: (error: unknown) => {
          const msg =
            error instanceof Error ? error.message : 'An error occurred';
          toast({ title: 'Failed to reject refund', description: msg, variant: 'destructive' });
        },
      }
    );
  };

  // ── loading ──
  if (isLoading) {
    return <RefundDetailSkeleton />;
  }

  // ── error ──
  if (isError || !refund) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-bold">Refund not found</h2>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          The refund you are looking for does not exist or could not be loaded.
        </p>
        <Button variant="outline" onClick={() => router.push(ADMIN_ROUTES.REFUNDS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Refunds
        </Button>
      </div>
    );
  }

  const status = refund.status;

  return (
    <>
      {/* ── back navigation ── */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 pl-0 text-muted-foreground hover:text-foreground"
        onClick={() => router.push(ADMIN_ROUTES.REFUNDS)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Refunds
      </Button>

      {/* ── page header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {refund.refundCode || `Refund #${id.slice(0, 8).toUpperCase()}`}
            </h1>
            <AdminStatusBadge type="refund" status={status} />
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Created {formatDate(refund.createdAt)}
          </p>
        </div>

        {/* status-aware actions */}
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <>
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => setApproveModalOpen(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectReason('');
                  setRejectModalOpen(true);
                }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          {(status === 'processing' || status === 'failed') && (
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* ── main grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── left: info cards ── */}
        <div className="space-y-6 lg:col-span-2">

          {/* Section 1: Refund Overview */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="h-4 w-4 text-muted-foreground" />
                Refund Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Amount hero */}
              <div className="mb-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 p-5 text-center">
                <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Refund Amount
                </p>
                <p className="text-4xl font-extrabold tracking-tight text-primary">
                  {formatCurrency(refund.amount)}
                </p>
              </div>

              <FieldRow label="Refund Code" value={refund.refundCode || '–'} mono />
              <FieldRow
                label="Status"
                value=""
                valueClassName="hidden"
                // rendered inline below
                label-override="Status"
              />
              {/* status inline row */}
              <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">Status</span>
                <AdminStatusBadge type="refund" status={status} />
              </div>
              <FieldRow label="Created At" value={formatDate(refund.createdAt)} />
              {refund.reason && (
                <div className="pt-3">
                  <p className="mb-1.5 text-sm text-muted-foreground">Refund Reason</p>
                  <p className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
                    {refund.reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Student Information */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-muted-foreground" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">Student Name</span>
                {refund.student.id ? (
                  <Link
                    href={ADMIN_ROUTES.USER_DETAIL(refund.student.id)}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {refund.student.fullName || '–'}
                  </Link>
                ) : (
                  <span className="text-sm font-medium">{refund.student.fullName || '–'}</span>
                )}
              </div>
              <FieldRow label="Student ID" value={refund.student.id || '–'} mono />
            </CardContent>
          </Card>

          {/* Section 3: Booking Information */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">Booking Code</span>
                {refund.booking.id ? (
                  <Link
                    href={ADMIN_ROUTES.BOOKING_DETAIL(refund.booking.id)}
                    className="font-mono text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {refund.booking.bookingCode || '–'}
                  </Link>
                ) : (
                  <span className="font-mono text-sm font-medium">
                    {refund.booking.bookingCode || '–'}
                  </span>
                )}
              </div>
              <FieldRow label="Booking ID" value={refund.booking.id || '–'} mono />
            </CardContent>
          </Card>

          {/* Section 4: Payment Information */}
          <Card>
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">Payment ID</span>
                {refund.payment.id ? (
                  <Link
                    href={ADMIN_ROUTES.PAYMENT_DETAIL(refund.payment.id)}
                    className="font-mono text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {refund.payment.id}
                  </Link>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">–</span>
                )}
              </div>
              {refund.payment.paymentCode && refund.payment.paymentCode !== 'N/A' && (
                <FieldRow label="Payment Code" value={refund.payment.paymentCode} mono />
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── right: timeline ── */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-base">Refund Workflow</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <RefundTimeline refund={refund} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── approve modal ── */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Refund Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this refund request? The student will be
              eligible for a refund of{' '}
              <span className="font-semibold text-foreground">
                {formatCurrency(refund.amount)}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveModalOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Approving…
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── reject modal ── */}
      <Dialog
        open={rejectModalOpen}
        onOpenChange={(open) => {
          if (!open) setRejectReason('');
          setRejectModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Refund Request</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting this refund. The reason will be stored
              against this record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="reject-reason" className="mb-2 block text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-reason"
              placeholder="Enter rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectReason('');
                setRejectModalOpen(false);
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting…
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
