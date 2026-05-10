import { SettingsLayout, ChangePasswordForm } from '@/features/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password | Connecti',
  description: 'Update your account security and password.',
};

export default function PasswordSettings() {
  return (
    <SettingsLayout>
      <ChangePasswordForm />
    </SettingsLayout>
  );
}
