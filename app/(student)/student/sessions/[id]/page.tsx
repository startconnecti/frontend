import { SessionDetailPage } from '@/features/sessions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Session Details | Connecti',
  description: 'View session schedule, meeting links, and payment summary.',
};

export default function StudentSessionDetail() {
  return <SessionDetailPage />;
}
