import { Metadata } from 'next';
import { ChangeRequestsPage } from '@/features/tutor-profile/components/change-requests-page';

export const metadata: Metadata = {
  title: 'Change Requests | Tutor Profile | StartConnect',
  description: 'Manage your profile change requests.',
};

export default function Page() {
  return <ChangeRequestsPage />;
}
