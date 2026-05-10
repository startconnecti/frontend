import { TutorProfilePage } from '@/features/tutors/components/tutor-profile-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Profile | Connecti',
  description: 'Learn more about this expert tutor and book a session.',
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  return <TutorProfilePage id={params.id} />;
}
