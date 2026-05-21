'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Calendar, User, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAdminSessionDetailQuery, useAdminCancelSessionMutation, useAdminForceCompleteSessionMutation } from '@/features/admin-sessions';

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

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showForceCompleteDialog, setShowForceCompleteDialog] = useState(false);

  const cancelMutation = useAdminCancelSessionMutation();
  const forceCompleteMutation = useAdminForceCompleteSessionMutation();

  const {
    data: session,
    isLoading,
    isError,
  } = useAdminSessionDetailQuery(sessionId);

  const handleCancel = () => {
    cancelMutation.mutate({ id: sessionId, reason: 'Cancelled by Admin' }, {
      onSuccess: () => setShowCancelDialog(false)
    });
  };

  const handleForceComplete = () => {
    forceCompleteMutation.mutate({ id: sessionId, reason: 'Force completed by Admin' }, {
      onSuccess: () => setShowForceCompleteDialog(false)
    });
  };

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="p-6">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (isError || !session) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
          </div>
        </div>
        <AdminRecordNotFound href="/admin/sessions" />
      </>
    );
  }

  const showCancelBtn = !['cancelled', 'completed'].includes(session.status);
  const showForceCompleteBtn = session.status === 'scheduled' || session.status === 'ongoing';

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/sessions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showForceCompleteBtn && (
            <Button onClick={() => setShowForceCompleteDialog(true)} disabled={forceCompleteMutation.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" /> Force Complete
            </Button>
          )}
          {showCancelBtn && (
            <Button variant="destructive" onClick={() => setShowCancelDialog(true)} disabled={cancelMutation.isPending}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Info */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{session.subjectName}</h2>
              <AdminStatusBadge status={session.status} />
            </div>
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Session ID</p>
                  <p className="font-mono text-sm mt-1">{session.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-sm mt-1">
                    <Link href={`/admin/bookings/${session.bookingId}`} className="text-primary hover:underline">
                      {session.bookingId}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Time</p>
                    <p className="text-sm font-medium mt-1">{formatDate(session.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">End Time</p>
                    <p className="text-sm font-medium mt-1">{formatDate(session.endTime)}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-sm font-bold mt-1">${session.amount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                {session.meetingUrl && (
                  <div>
                    <p className="text-xs text-muted-foreground">Meeting Link</p>
                    <p className="text-sm mt-1">
                      <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {session.meetingUrl}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Participants */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Participants</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Student</p>
                  <p className="text-sm text-muted-foreground">{session.student?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{session.student?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Tutor</p>
                  <p className="text-sm text-muted-foreground">{session.tutor?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{session.tutor?.email}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card className="p-6 bg-muted/50">
            <h4 className="mb-4 text-sm font-bold text-foreground">Timestamps</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground w-20">Created At:</span>
                <span className="font-medium">{formatDate(session.createdAt)}</span>
              </div>
              {session.updatedAt && (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground w-20">Updated At:</span>
                  <span className="font-medium">{formatDate(session.updatedAt)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleCancel(); }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              Cancel Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showForceCompleteDialog} onOpenChange={setShowForceCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Force Complete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to force complete this session? This is typically used if a session ended but didn't update automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleForceComplete(); }}
              className="bg-green-600 hover:bg-green-600/90"
              disabled={forceCompleteMutation.isPending}
            >
              Force Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
