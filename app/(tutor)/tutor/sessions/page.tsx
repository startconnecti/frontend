import { Metadata } from 'next';
import { TutorSessionsPage } from '@/features/sessions';

export const metadata: Metadata = {
  title: 'My Teaching Sessions | Connecti',
  description: 'Manage your upcoming and past teaching sessions.',
};

export default function TutorSessionsRoute() {
  return <TutorSessionsPage />;
}
