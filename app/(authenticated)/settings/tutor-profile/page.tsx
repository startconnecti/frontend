import { SettingsLayout, TutorProfileSettings } from '@/features/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Profile Settings | Connecti',
  description: 'Manage your tutor profile preferences and credentials.',
};

export default function TutorProfilePage() {
  return (
    <SettingsLayout>
      <TutorProfileSettings />
    </SettingsLayout>
  );
}
