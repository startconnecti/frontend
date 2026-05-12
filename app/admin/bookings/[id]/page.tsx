'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, User } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminBookingDetailQuery } from '@/features/admin-bookings';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check for invalid or epoch dates
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

  const {
    data: booking,
    isLoading,
    isError,
  } = useAdminBookingDetailQuery(bookingId);

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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-bold mt-1">${booking.amount.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <div className="mt-2">
                  <AdminStatusBadge status={booking.paymentStatus} />
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
        </div>
      </div>
    </>
  );
}
