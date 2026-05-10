import { MessagesPage } from '@/features/messages';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Message Thread | Connecti',
  description: 'Chat with your tutors and students.',
};

export default function MessageDetail() {
  return <MessagesPage />;
}
