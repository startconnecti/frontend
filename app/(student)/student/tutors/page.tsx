import { StudentTutorListPage } from '@/features/tutors/components/student-tutor-list-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Tutors | Connecti',
  description: 'Find and book top-rated tutors.',
};

export default function StudentTutorsPage() {
  return <StudentTutorListPage />;
}
