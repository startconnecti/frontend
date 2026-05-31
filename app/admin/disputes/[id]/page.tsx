'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Hash,
} from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminDisputeDetailQuery,
  useAdminMarkReviewingMutation,
  useAdminResolveDisputeMutation,
  useAdminRejectDisputeMutation,
  useAdminCloseDisputeMutation,
  type AdminDisputeStatus,
} from '@/features/admin-disputes';

// ─── Formatters ───────────────────────────────────────────────────────────────

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

// ─── Action visibility ────────────────────────────────────────────────────────

function getDisputeActions(status: AdminDisputeStatus) {
  return {
    canStartReview: status === 'open' || status === 'pending',
    canResolve: status === 'reviewing' || status === 'pending',
    canReject: status === 'open' || status === 'pending' || status === 'reviewing',
    canClose: status === 'resolved' || status === 'rejected',
  };
}

// ─── Timeline config ──────────────────────────────────────────────────────────

type TimelineStep = { label: string; field: string };

const MAIN_TIMELINE: TimelineStep[] = [
  { label: 'Submitted', field: 'createdAt' },
  { label: 'Under Review', field: '' },
  { label: 'Resolved', field: '' },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DisputeDetailSkeleton() {
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ADMIN_ROUTES.DISPUTES}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Skeleton className="h-9 w-52" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-16 w-full" />
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

type ActiveDialog = 'review' | 'resolve' | 'reject' | 'close' | null;

export default function DisputeDetailPage() {
  const params = useParams();
  const disputeId = params.id as string;

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [closeNote, setCloseNote] = useState('');

  const markReviewingMutation = useAdminMarkReviewingMutation();
  const resolveMutation = useAdminResolveDisputeMutation();
  const rejectMutation = useAdminRejectDisputeMutation();
  const closeMutation = useAdminCloseDisputeMutation();

  const { data: apiResponse, isLoading, isError } = useAdminDisputeDetailQuery(disputeId);

  function closeDialog() {
    setActiveDialog(null);
    setResolutionNote('');
    setRejectReason('');
    setCloseNote('');
  }

  if (isLoading) return <DisputeDetailSkeleton />;

  const dispute = apiResponse?.dispute;

  if (isError || !dispute) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href={ADMIN_ROUTES.DISPUTES}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Dispute Details</h1>
        </div>
        <AdminRecordNotFound href={ADMIN_ROUTES.DISPUTES} />
      </>
    );
  }

  const displayCode = dispute.disputeCode || dispute.id.substring(0, 8).toUpperCase();
  const { canStartReview, canResolve, canReject, canClose } = getDisputeActions(dispute.status);

  const isResolved = dispute.status === 'resolved';
  const isRejected = dispute.status === 'rejected';
  const isClosed = dispute.status === 'closed';

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href={ADMIN_ROUTES.DISPUTES}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{displayCode}</h1>
            <AdminStatusBadge status={dispute.status} type="dispute" />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canStartReview && (
            <Button
              variant="outline"
              onClick={() => setActiveDialog('review')}
              disabled={markReviewingMutation.isPending}
            >
              <Search className="mr-2 h-4 w-4" /> Start Review
            </Button>
          )}
          {canResolve && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setActiveDialog('resolve')}
              disabled={resolveMutation.isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Resolve
            </Button>
          )}
          {canReject && (
            <Button
              variant="destructive"
              onClick={() => setActiveDialog('reject')}
              disabled={rejectMutation.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" /> Reject
            </Button>
          )}
          {canClose && (
            <Button
              variant="outline"
              onClick={() => setActiveDialog('close')}
              disabled={closeMutation.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" /> Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Participants */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" /> Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-3">Student</p>
                <p className="text-sm font-medium">{dispute.studentName ?? '-'}</p>
                {dispute.studentId && (
                  <p className="font-mono text-xs text-muted-foreground mt-1 break-all">{dispute.studentId}</p>
                )}
                {dispute.studentId && (
                  <Link
                    href={ADMIN_ROUTES.USER_DETAIL(dispute.studentId)}
                    className="text-xs text-primary underline-offset-4 hover:underline mt-2 inline-block"
                  >
                    View Student
                  </Link>
                )}
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-3">Tutor</p>
                <p className="text-sm font-medium">{dispute.tutorName ?? '-'}</p>
                {dispute.tutorProfileId && (
                  <p className="font-mono text-xs text-muted-foreground mt-1 break-all">{dispute.tutorProfileId}</p>
                )}
                {dispute.tutorProfileId && (
                  <Link
                    href={ADMIN_ROUTES.TUTOR_DETAIL(dispute.tutorProfileId)}
                    className="text-xs text-primary underline-offset-4 hover:underline mt-2 inline-block"
                  >
                    View Tutor
                  </Link>
                )}
              </div>
            </div>
          </Card>

          {/* Session Information */}
          {dispute.sessionId && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" /> Session Information
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Session ID</p>
                <p className="font-mono text-sm mt-1 break-all">{dispute.sessionId}</p>
                <Link
                  href={ADMIN_ROUTES.SESSION_DETAIL(dispute.sessionId)}
                  className="text-xs text-primary underline-offset-4 hover:underline mt-2 inline-block"
                >
                  View Session
                </Link>
              </div>
            </Card>
          )}

          {/* Dispute Content */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" /> Dispute Content
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Reason</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{dispute.reason ?? 'No reason provided.'}</p>
              </div>
            </div>
          </Card>

          {/* Resolution Result */}
          {(isResolved || isRejected || isClosed) && (
            <Card className={`p-6 ${isResolved ? 'border-green-200 bg-green-50' : isRejected ? 'border-destructive/20 bg-destructive/5' : 'border-border bg-muted/40'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isResolved ? 'text-green-800' : isRejected ? 'text-destructive' : 'text-foreground'}`}>
                {isResolved ? 'Resolution' : isRejected ? 'Rejection' : 'Closure'}
              </h3>
              <div className="space-y-3">
                {isResolved && (
                  <>
                    {dispute.resolutionType && (
                      <div>
                        <p className="text-xs text-green-700/70">Resolution Type</p>
                        <p className="text-sm font-medium text-green-800 mt-1 capitalize">
                          {dispute.resolutionType.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )}
                    {dispute.resolutionNote && (
                      <div>
                        <p className="text-xs text-green-700/70">Resolution Note</p>
                        <p className="text-sm text-green-800 mt-1 whitespace-pre-wrap">{dispute.resolutionNote}</p>
                      </div>
                    )}
                    {dispute.refundAmount !== null && dispute.refundAmount !== undefined && (
                      <div>
                        <p className="text-xs text-green-700/70">Refund Amount</p>
                        <p className="text-sm font-semibold text-green-800 mt-1">
                          ₫{new Intl.NumberFormat('vi-VN').format(Math.round(dispute.refundAmount))}
                        </p>
                      </div>
                    )}
                  </>
                )}
                {isRejected && dispute.rejectReason && (
                  <div>
                    <p className="text-xs text-destructive/70">Rejection Reason</p>
                    <p className="text-sm text-destructive mt-1 whitespace-pre-wrap">{dispute.rejectReason}</p>
                  </div>
                )}
                {isClosed && dispute.closeNote && (
                  <div>
                    <p className="text-xs text-muted-foreground">Close Note</p>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{dispute.closeNote}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Resolution Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" /> Resolution Timeline
            </h3>
            <ol className="relative border-l border-border ml-3 space-y-6">
              {/* Always show: Submitted */}
              <li className="ml-6">
                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-green-500 border-green-500">
                  <CheckCircle className="h-3 w-3 text-white" />
                </span>
                <p className="text-sm font-medium">Submitted</p>
                <p className="text-xs text-muted-foreground">{formatDate(dispute.createdAt)}</p>
              </li>

              {/* Under Review */}
              {['reviewing', 'resolved', 'rejected', 'closed'].includes(dispute.status) ? (
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-green-500 border-green-500">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </span>
                  <p className="text-sm font-medium">Under Review</p>
                  <p className="text-xs text-muted-foreground">{formatDate(dispute.updatedAt)}</p>
                </li>
              ) : (
                <li className="ml-6">
                  <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${dispute.status === 'reviewing' ? 'bg-primary border-primary' : 'bg-muted border-border'}`} />
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </li>
              )}

              {/* Terminal state */}
              {isResolved && (
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-green-500 border-green-500">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </span>
                  <p className="text-sm font-medium text-green-700">Resolved</p>
                  <p className="text-xs text-muted-foreground">{formatDate(dispute.updatedAt)}</p>
                </li>
              )}
              {isRejected && (
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-destructive border-destructive">
                    <XCircle className="h-3 w-3 text-white" />
                  </span>
                  <p className="text-sm font-medium text-destructive">Rejected</p>
                  <p className="text-xs text-muted-foreground">{formatDate(dispute.updatedAt)}</p>
                </li>
              )}
              {isClosed && (
                <li className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-gray-400 border-gray-400">
                    <XCircle className="h-3 w-3 text-white" />
                  </span>
                  <p className="text-sm font-medium text-muted-foreground">Closed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(dispute.updatedAt)}</p>
                </li>
              )}
            </ol>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <Card className="p-6 bg-muted/50">
            <h4 className="text-sm font-bold text-foreground mb-4">Raw Information</h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground">Dispute ID</p>
                <p className="font-mono break-all mt-0.5">{dispute.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dispute Code</p>
                <p className="font-mono mt-0.5">{dispute.disputeCode || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium mt-0.5">{formatDate(dispute.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium mt-0.5">{formatDate(dispute.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Start Review Dialog ── */}
      <AlertDialog open={activeDialog === 'review'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Review</AlertDialogTitle>
            <AlertDialogDescription>
              Mark {displayCode} as under review. You can resolve or reject it after review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault();
                markReviewingMutation.mutate({ disputeId }, { onSuccess: closeDialog });
              }}
              disabled={markReviewingMutation.isPending}
            >
              Start Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Resolve Dialog ── */}
      <AlertDialog open={activeDialog === 'resolve'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolve Dispute</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a resolution note for {displayCode}. A resolution type of &quot;admin_decision&quot; will be recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-2">
            <Label htmlFor="resolution-note" className="text-sm font-medium">
              Resolution Note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="resolution-note"
              className="mt-2"
              rows={4}
              placeholder="Describe the resolution outcome..."
              value={resolutionNote}
              onChange={e => setResolutionNote(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault();
                resolveMutation.mutate(
                  {
                    disputeId,
                    resolutionType: 'admin_decision',
                    resolutionNote: resolutionNote.trim() || undefined,
                  },
                  { onSuccess: closeDialog },
                );
              }}
              className="bg-green-600 hover:bg-green-700"
              disabled={resolveMutation.isPending}
            >
              Resolve Dispute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Reject Dialog ── */}
      <AlertDialog open={activeDialog === 'reject'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Dispute</AlertDialogTitle>
            <AlertDialogDescription>
              Provide a reason for rejecting {displayCode}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-2">
            <Label htmlFor="reject-reason" className="text-sm font-medium">
              Reason <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="reject-reason"
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
              onClick={e => {
                e.preventDefault();
                rejectMutation.mutate(
                  { disputeId, reason: rejectReason.trim() || undefined },
                  { onSuccess: closeDialog },
                );
              }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={rejectMutation.isPending}
            >
              Reject Dispute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Close Dialog ── */}
      <AlertDialog open={activeDialog === 'close'} onOpenChange={open => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Dispute</AlertDialogTitle>
            <AlertDialogDescription>
              Close {displayCode}. You may add an optional note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="pb-2">
            <Label htmlFor="close-note" className="text-sm font-medium">
              Note <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="close-note"
              className="mt-2"
              rows={3}
              placeholder="Add a closing note..."
              value={closeNote}
              onChange={e => setCloseNote(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault();
                closeMutation.mutate(
                  { disputeId, note: closeNote.trim() || undefined },
                  { onSuccess: closeDialog },
                );
              }}
              disabled={closeMutation.isPending}
            >
              Close Dispute
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
