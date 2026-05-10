import { StudentSessionsPage } from '@/features/sessions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Sessions | Connecti',
  description: 'Manage your scheduled and past learning sessions.',
};

export default function StudentSessions() {
  return <StudentSessionsPage />;
}
