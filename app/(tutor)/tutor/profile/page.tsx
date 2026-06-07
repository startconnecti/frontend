import { TutorProfileSettings } from '@/features/settings';
import { PageContainer } from '@/components/shared';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Management | Tutor Connecti',
  description: 'Manage your professional tutor profile and credentials.',
};

export default function TutorProfileRoute() {
  return (
    <PageContainer className="py-8 space-y-10 max-w-5xl">
      <TutorProfileSettings />
    </PageContainer>
  );
}
