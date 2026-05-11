'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminLoginMutation } from '@/features/admin-auth';
import { AdminApiError } from '@/lib/admin-api/errors';
import { useAdminAuthStore } from '@/stores/admin-auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminAuthStore((state) => state.login);
  const adminLoginMutation = useAdminLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLoading = adminLoginMutation.isPending;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await adminLoginMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      login(response.admin, response.accessToken, response.refreshToken);
      router.push(ADMIN_ROUTES.DASHBOARD);
    } catch (loginError) {
      if (AdminApiError.isAdminApiError(loginError)) {
        setError(loginError.message);
        return;
      }

      setError('Unable to sign in. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="px-6 py-8">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <Image src="/connecti-logo-mark.svg" alt="Connecti" width={40} height={40} />
              <span className="text-2xl font-bold text-brand-dark">Connecti</span>
            </div>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access the admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@connecti.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Use your Connecti admin account to continue.
          </div>
        </div>
      </Card>
    </div>
  );
}