import { StudentDashboardPage } from '@/features/student-dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | Connecti',
  description: 'Manage your learning journey, sessions, and tutors.',
};

export default function StudentDashboard() {
  return <StudentDashboardPage />;
}
