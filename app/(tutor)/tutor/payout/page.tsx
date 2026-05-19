import { TutorPayoutPage } from '@/features/payout/components/tutor-payout-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payouts | Connecti',
  description: 'Request payouts and view your withdrawal history.',
};

export default function PayoutPage() {
  return <TutorPayoutPage />;
}
