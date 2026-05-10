import { SettingsLayout, ProfileSettingsPage } from '@/features/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings | Connecti',
  description: 'Manage your personal information and account details.',
};

export default function ProfileSettings() {
  return (
    <SettingsLayout>
      <ProfileSettingsPage />
    </SettingsLayout>
  );
}
