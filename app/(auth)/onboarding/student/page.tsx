import { StudentOnboardingPage } from '@/features/onboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Profile | Connecti Student',
  description: 'Finish setting up your student profile to start learning.',
};

export default function StudentOnboarding() {
  return <StudentOnboardingPage />;
}
