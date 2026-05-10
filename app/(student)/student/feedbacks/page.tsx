import { StudentFeedbacksPage } from '@/features/feedbacks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Feedbacks | Connecti',
  description: 'View the feedback you have provided for your tutors.',
};

export default function StudentFeedbacksRoute() {
  return <StudentFeedbacksPage />;
}
