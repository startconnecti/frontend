import { ForgotPasswordPage } from '@/features/auth/components/forgot-password-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Connecti',
  description: 'Reset your Connecti account password.',
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
