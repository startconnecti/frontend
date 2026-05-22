'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, User, CheckCircle, XCircle, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CancelBookingDialog } from '@/features/admin-bookings/components/cancel-booking-dialog';
import { useAdminBookingDetailQuery, useConfirmBookingMutation, useExpireBookingMutation } from '@/features/admin-bookings';

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

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showExpireDialog, setShowExpireDialog] = useState(false);

  const confirmMutation = useConfirmBookingMutation();
  const expireMutation = useExpireBookingMutation();

  const {
    data: booking,
    isLoading,
    isError,
  } = useAdminBookingDetailQuery(bookingId);

  const handleConfirm = () => {
    confirmMutation.mutate(bookingId);
  };

  const handleExpire = () => {
    expireMutation.mutate(bookingId, {
      onSuccess: () => setShowExpireDialog(false)
    });
  };

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
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

  if (isError || !booking) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
          </div>
        </div>
        <AdminRecordNotFound href="/admin/bookings" />
      </>
    );
  }

  const showConfirmBtn = booking.status === 'pending' || booking.status === 'wait_for_admin_review';
  const showCancelBtn = !['cancelled', 'completed', 'expired'].includes(booking.status);
  const showExpireBtn = booking.status === 'pending' || booking.status === 'pending_payment';

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/bookings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Booking Details</h1>
        </div>
      </div>

      {(booking.warning || booking.cancellationReason || booking.expirationReason || booking.reason || booking.notes) && (
        <div className="mb-6 space-y-4">
          {booking.warning && (
            <Alert className="border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 stroke-amber-600 dark:stroke-amber-400" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">Attention</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-200">
                {booking.warning}
              </AlertDescription>
            </Alert>
          )}
          {(booking.cancellationReason || (booking.status === 'cancelled' && booking.reason)) && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Cancellation Reason</AlertTitle>
              <AlertDescription>{booking.cancellationReason || booking.reason}</AlertDescription>
            </Alert>
          )}
          {booking.expirationReason && (
            <Alert className="border-orange-500 bg-orange-50 text-orange-900 dark:bg-orange-950 dark:text-orange-200">
              <Clock className="h-4 w-4 stroke-orange-600 dark:stroke-orange-400" />
              <AlertTitle className="text-orange-800 dark:text-orange-300">Expiration Reason</AlertTitle>
              <AlertDescription className="text-orange-700 dark:text-orange-200">
                {booking.expirationReason}
              </AlertDescription>
            </Alert>
          )}
          {booking.notes && (
            <Alert>
              <AlertTitle>Internal Notes</AlertTitle>
              <AlertDescription>{booking.notes}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{booking.subjectName}</h2>
              <AdminStatusBadge status={booking.status} />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Booking ID</p>
                <p className="font-mono text-sm mt-1">{booking.id}</p>
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
                  <p className="text-sm text-muted-foreground">{booking.student.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{booking.student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Tutor</p>
                  <p className="text-sm text-muted-foreground">{booking.tutor.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{booking.tutor.email}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Session Info */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Session Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="text-sm font-medium mt-1">{formatDate(booking.startTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-sm font-medium mt-1">{formatDate(booking.endTime)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Payment</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-bold mt-1">${booking.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <Card className="p-6 bg-muted/50">
            <h4 className="mb-2 text-sm font-bold text-foreground">Booking Created</h4>
            <p className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</p>
          </Card>

          <Card className="p-6">
            <h4 className="mb-4 text-sm font-bold text-foreground">Management Actions</h4>
            <div className="space-y-3">
              {showConfirmBtn && (
                <Button className="w-full justify-start" onClick={handleConfirm} disabled={confirmMutation.isPending}>
                  {confirmMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-600" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  )}
                  Confirm Booking
                </Button>
              )}
              {showExpireBtn && (
                <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700" onClick={() => setShowExpireDialog(true)} disabled={expireMutation.isPending}>
                  <Clock className="mr-2 h-4 w-4" /> Expire Booking
                </Button>
              )}
              {showCancelBtn && (
                <Button variant="destructive" className="w-full justify-start" onClick={() => setShowCancelDialog(true)}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                </Button>
              )}
              {!showConfirmBtn && !showExpireBtn && !showCancelBtn && (
                <p className="text-xs text-muted-foreground text-center">No actions available for this status.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <CancelBookingDialog 
        isOpen={showCancelDialog} 
        onClose={() => setShowCancelDialog(false)}
        bookingId={bookingId}
        warningMessage={booking?.warning || null}
      />

      <AlertDialog open={showExpireDialog} onOpenChange={setShowExpireDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Expire Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to manually expire this booking? This is typically used for unpaid or neglected bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleExpire(); }}
              className="bg-orange-600 hover:bg-orange-600/90"
              disabled={expireMutation.isPending}
            >
              {expireMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Expiring...
                </>
              ) : (
                'Expire Booking'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
