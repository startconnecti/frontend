import { TutorDashboardPlaceholder } from '@/features/dashboard/components/tutor-dashboard-placeholder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Dashboard | Connecti',
  description: 'Manage your teaching profile and student sessions.',
};

export default function TutorDashboard() {
  return <TutorDashboardPlaceholder />;
}
