import { CreateFeedbackPage } from '@/features/feedbacks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Feedback | Connecti',
  description: 'Share your experience about your recent tutoring session.',
};

export default function CreateFeedbackRoute() {
  return <CreateFeedbackPage />;
}
