import { TutorReviewsPage } from '@/features/feedbacks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Reviews | Tutor Connecti',
  description: 'Monitor your teaching performance and student reviews.',
};

export default function TutorReviewsRoute() {
  return <TutorReviewsPage />;
}
