import { StudentPaymentsPage } from '@/features/payments';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Payments | Connecti',
  description: 'Manage your learning investments and view transaction history.',
};

export default function StudentPayments() {
  return <StudentPaymentsPage />;
}
