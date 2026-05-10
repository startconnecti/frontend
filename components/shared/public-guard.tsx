'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/constants/routes';
import { LoadingState } from './loading-state';

interface PublicGuardProps {
  children: ReactNode;
}

export function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated && user) {
      const dashboard = user.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
      router.push(dashboard);
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return <>{children}</>;
}
