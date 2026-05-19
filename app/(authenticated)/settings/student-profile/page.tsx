import { SettingsLayout, StudentProfileSettings } from '@/features/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Profile Settings | Connecti',
  description: 'Manage your student profile preferences and favorite subjects.',
};

export default function StudentProfilePage() {
  return (
    <SettingsLayout>
      <StudentProfileSettings />
    </SettingsLayout>
  );
}
