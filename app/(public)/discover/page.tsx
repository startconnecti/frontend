import { TutorDiscoverPage } from '@/features/tutors/components/tutor-discover-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Tutors | Connecti',
  description: 'Find and book top-rated tutors for any subject.',
};

export default function DiscoverPage() {
  return <TutorDiscoverPage />;
}
