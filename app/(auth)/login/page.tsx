import { LoginPage } from '@/features/auth/components/login-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Connecti',
  description: 'Access your Connecti account to manage sessions and learning.',
};

export default function Login() {
  return <LoginPage />;
}
