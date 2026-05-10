import { RegisterPage } from '@/features/auth/components/register-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | Connecti',
  description: 'Join the world largest tutor marketplace.',
};

export default function Register() {
  return <RegisterPage />;
}
