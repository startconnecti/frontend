import { StudentDashboardPlaceholder } from '@/features/dashboard/components/student-dashboard-placeholder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Dashboard | Connecti',
  description: 'Manage your learning and upcoming sessions.',
};

export default function StudentDashboard() {
  return <StudentDashboardPlaceholder />;
}
