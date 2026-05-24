import { SettingsLayout } from '@/features/settings';
import { ChangeRequestsPage } from '@/features/tutor-profile/components/change-requests-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Requests | Tutor Profile | Connecti',
  description: 'View and manage your tutor profile change requests.',
};

export default function TutorProfileChangeRequestsRoute() {
  return (
    <SettingsLayout>
      <ChangeRequestsPage />
    </SettingsLayout>
  );
}
