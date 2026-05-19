import { TutorIncomePage } from '@/features/income/components/tutor-income-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Income & Earnings | Connecti',
  description: 'View your tutor earnings and payment transactions.',
};

export default function IncomePage() {
  return <TutorIncomePage />;
}
