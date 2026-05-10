import { PaymentDetailPage } from '@/features/payments';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction Details | Connecti',
  description: 'View full invoice details and payment breakdown.',
};

export default function StudentPaymentDetail() {
  return <PaymentDetailPage />;
}
