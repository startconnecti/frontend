import { TutorAvailabilityPage } from '@/features/tutor-availability';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Availability Management | Tutor Connecti',
  description: 'Manage your weekly teaching schedule and availability slots.',
};

export default function TutorAvailabilityRoute() {
  return <TutorAvailabilityPage />;
}
