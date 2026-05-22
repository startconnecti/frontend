'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAdminBookingDetailQuery, useConfirmBookingMutation, useCancelBookingMutation, useExpireBookingMutation } from '@/features/admin-bookings';

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
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [showExpireDialog, setShowExpireDialog] = useState(false);

  const confirmMutation = useConfirmBookingMutation();
  const cancelMutation = useCancelBookingMutation();
  const expireMutation = useExpireBookingMutation();

  const {
    data: booking,
    isLoading,
    isError,
  } = useAdminBookingDetailQuery(bookingId);

  const handleConfirm = () => {
    confirmMutation.mutate(bookingId);
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      setCancelReasonError('Reason is required');
      return;
    }
    if (cancelReason.length > 1000) {
      setCancelReasonError('Reason must be less than 1000 characters');
      return;
    }
    setCancelReasonError('');
    cancelMutation.mutate({ id: bookingId, reason: cancelReason.trim() }, {
      onSuccess: () => {
        setShowCancelDialog(false);
        setCancelReason('');
      }
    });
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-sm mt-1">{booking.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-2">
                    <AdminStatusBadge status={booking.status} />
                  </div>
                </div>
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
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Confirm Booking
                </Button>
              )}
              {showExpireBtn && (
                <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700" onClick={() => setShowExpireDialog(true)} disabled={expireMutation.isPending}>
                  <Clock className="mr-2 h-4 w-4" /> Expire Booking
                </Button>
              )}
              {showCancelBtn && (
                <Button variant="destructive" className="w-full justify-start" onClick={() => setShowCancelDialog(true)} disabled={cancelMutation.isPending}>
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

      <AlertDialog 
        open={showCancelDialog} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCancelDialog(false);
            setCancelReason('');
            setCancelReasonError('');
          } else {
            setShowCancelDialog(true);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              Please provide a reason for cancellation below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label htmlFor="cancel-reason" className="text-sm font-medium mb-2 block">
              Reason for Cancellation <span className="text-destructive">*</span>
            </label>
            <Textarea 
              id="cancel-reason"
              placeholder="E.g., Requested by user, tutor unavailable..."
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (cancelReasonError) setCancelReasonError('');
              }}
              className="resize-none"
              rows={3}
            />
            {cancelReasonError && (
              <p className="text-destructive text-xs mt-2">{cancelReasonError}</p>
            )}
            <p className="text-muted-foreground text-xs mt-2 text-right">
              {cancelReason.length} / 1000
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleCancel(); }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              Expire Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
