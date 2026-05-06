'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, User } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mockBookings, mockUsers, mockTutors } from '@/lib/admin/mock-data';

interface PageProps {
  params: {
    id: string;
  };
}

export default function BookingDetailPage({ params }: PageProps) {
  const booking = mockBookings.find(b => b.id === params.id);
  const student = mockUsers.find(u => u.id === booking?.studentId);
  const tutor = mockTutors.find(t => t.id === booking?.tutorId);

  if (!booking || !student || !tutor) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">Booking not found</p>
          <Link href="/admin/bookings">
            <Button className="mt-4" variant="outline">Back to Bookings</Button>
          </Link>
        </Card>
      </div>
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
              <h2 className="text-2xl font-bold text-foreground">{booking.subject}</h2>
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
                  <p className="text-sm text-muted-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-border p-4">
                <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Tutor</p>
                  <p className="text-sm text-muted-foreground">{tutor.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tutor.email}</p>
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
                  <p className="text-sm font-medium mt-1">{new Date(booking.startTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="text-sm font-medium mt-1">{new Date(booking.endTime).toLocaleString()}</p>
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
                  <p className="text-sm font-bold mt-1">${booking.amount}</p>
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
          {booking.status === 'confirmed' && (
            <AdminConfirmDialog
              title="Cancel Booking?"
              description="This will cancel the booking and may trigger refund processing."
              actionLabel="Cancel Booking"
              actionVariant="destructive"
              triggerLabel="Cancel Booking"
              triggerVariant="destructive"
              onConfirm={() => console.log('Booking cancelled')}
            />
          )}

          <Card className="p-6">
            <h4 className="mb-3 font-bold text-foreground">Internal Notes</h4>
            <Textarea placeholder="Add internal notes..." rows={4} />
            <Button className="mt-3 w-full">Save Notes</Button>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h4 className="mb-2 text-sm font-bold text-foreground">Booking Created</h4>
            <p className="text-xs text-muted-foreground">{booking.createdAt}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
