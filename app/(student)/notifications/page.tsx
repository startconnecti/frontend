import { NotificationsPage } from '@/features/notifications';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | Connecti',
  description: 'Keep track of your learning journey with real-time updates.',
};

export default function Notifications() {
  return <NotificationsPage />;
}
