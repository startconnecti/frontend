import { TutorProfilePage } from '@/features/tutors/components/tutor-profile-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Profile | Connecti',
  description: 'Learn more about this expert tutor and book a session.',
};

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <TutorProfilePage id={id} />;
}
