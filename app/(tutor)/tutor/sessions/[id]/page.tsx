import { Metadata } from 'next';
import { TutorSessionDetailPage } from '@/features/sessions';

export const metadata: Metadata = {
  title: 'Teaching Session Details | Connecti',
  description: 'View details of your teaching session.',
};

export default function TutorSessionDetailRoute() {
  return <TutorSessionDetailPage />;
}
