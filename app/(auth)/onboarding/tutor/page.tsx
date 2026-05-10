import { TutorOnboardingPage } from '@/features/onboarding';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Application | Connecti',
  description: 'Complete your application to become an expert tutor.',
};

export default function TutorOnboarding() {
  return <TutorOnboardingPage />;
}
