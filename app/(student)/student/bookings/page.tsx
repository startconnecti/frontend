import { BookingListPage } from '@/features/bookings/components/booking-list-page';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Bookings | Connecti',
  description: 'Manage your lesson bookings and payments.',
};

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <BookingListPage />
    </Suspense>
  );
}
