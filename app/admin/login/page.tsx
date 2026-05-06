'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock login - any credentials work
    setTimeout(() => {
      if (email && password) {
        router.push('/admin');
      } else {
        setError('Please enter both email and password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="px-6 py-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <Image src="/connecti-logo-mark.svg" alt="Connecti" width={40} height={40} />
              <span className="text-2xl font-bold" style={{ color: '#2C1208' }}>
                Connecti
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
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
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
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
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
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

          {/* Footer */}
          <div className="mt-6 space-y-3 text-center text-sm">
            <a href="#" className="block text-primary hover:underline">
              Forgot password?
            </a>
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border"></div>
              <span className="text-muted-foreground">Demo credentials</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            <p className="text-muted-foreground">
              Use any email and password to access the demo
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
