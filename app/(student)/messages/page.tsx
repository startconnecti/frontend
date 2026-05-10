import { MessagesPage } from '@/features/messages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages | Connecti',
  description: 'Chat with your tutors and students.',
};

export default function Messages() {
  return <MessagesPage />;
}
