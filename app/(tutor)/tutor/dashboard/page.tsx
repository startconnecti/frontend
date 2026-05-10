import { TutorDashboardPage } from '@/features/tutor-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Dashboard | Connecti',
  description: 'Manage your teaching schedule, students, and earnings.',
};

export default function TutorDashboard() {
  return <TutorDashboardPage />;
}
