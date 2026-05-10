import { TutorProfileManagementPage } from '@/features/tutor-profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Management | Tutor Connecti',
  description: 'Manage your professional tutor profile and credentials.',
};

export default function TutorProfileRoute() {
  return <TutorProfileManagementPage />;
}
