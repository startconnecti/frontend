import { Metadata } from 'next';
import { TutorIncomePage } from '@/features/tutor-income/components/tutor-income-page';

export const metadata: Metadata = {
  title: 'Income | Connecti Tutor',
  description: 'View your earnings, payouts, and income history.',
};

export default function IncomeRoute() {
  return (
    <div className="flex flex-col gap-8">
      <TutorIncomePage />
    </div>
  );
}
