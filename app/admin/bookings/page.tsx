'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PAGINATION } from '@/constants/pagination';
import { useAdminBookingsQuery, useConfirmBookingMutation, useCancelBookingMutation, useExpireBookingMutation } from '@/features/admin-bookings';
import { toast } from 'sonner';

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

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [bookingToExpire, setBookingToExpire] = useState<string | null>(null);

  const { data: bookingsData, isLoading, isError } = useAdminBookingsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const confirmMutation = useConfirmBookingMutation();
  const cancelMutation = useCancelBookingMutation();
  const expireMutation = useExpireBookingMutation();

  const handleConfirm = (id: string) => {
    confirmMutation.mutate(id);
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
    if (bookingToCancel) {
      cancelMutation.mutate({ id: bookingToCancel, reason: cancelReason.trim() }, {
        onSuccess: () => {
          setBookingToCancel(null);
          setCancelReason('');
        }
      });
    }
  };

  const handleExpire = () => {
    if (bookingToExpire) {
      expireMutation.mutate(bookingToExpire, {
        onSuccess: () => setBookingToExpire(null)
      });
    }
  };

  const filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'payment_processing' },
    { label: 'Review', value: 'wait_for_admin_review' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Expired', value: 'expired' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-10" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !bookingsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading bookings
          </TableCell>
        </TableRow>
      );
    }

    if (bookingsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No bookings found
          </TableCell>
        </TableRow>
      );
    }

    return bookingsData.items.map(booking => {
      const showConfirm = booking.status === 'pending' || booking.status === 'wait_for_admin_review';
      const showCancel = !['cancelled', 'completed', 'expired'].includes(booking.status);
      const showExpire = booking.status === 'pending' || booking.status === 'pending_payment';

      return (
        <TableRow key={booking.id}>
          <TableCell className="font-mono text-sm">{booking.id}</TableCell>
          <TableCell>{booking.subjectName}</TableCell>
          <TableCell className="text-sm">{formatDate(booking.startTime)}</TableCell>
          <TableCell>
            <AdminStatusBadge status={booking.status} />
          </TableCell>
          <TableCell>${booking.amount.toFixed(2)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/admin/bookings/${booking.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                </Link>
                {showConfirm && (
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => handleConfirm(booking.id)}
                    disabled={confirmMutation.isPending}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Confirm
                  </DropdownMenuItem>
                )}
                {showExpire && (
                  <DropdownMenuItem 
                    className="cursor-pointer text-orange-600"
                    onClick={() => setBookingToExpire(booking.id)}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Expire
                  </DropdownMenuItem>
                )}
                {showCancel && (
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive"
                    onClick={() => setBookingToCancel(booking.id)}
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
      <AdminPageHeader title="Bookings Management" description="Manage and monitor booking activities." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search booking ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {filterTabs.map(tab => (
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
                <TableHead>Booking ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && bookingsData && bookingsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {bookingsData.page} of {bookingsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(bookingsData.totalPages, page + 1))}
                disabled={page === bookingsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog 
        open={!!bookingToCancel} 
        onOpenChange={(open) => {
          if (!open) {
            setBookingToCancel(null);
            setCancelReason('');
            setCancelReasonError('');
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

      <AlertDialog open={!!bookingToExpire} onOpenChange={(open) => !open && setBookingToExpire(null)}>
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
