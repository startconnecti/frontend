'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminAuthStore } from '@/stores/admin-auth-store';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isHydrated = useAdminAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const isLoginPage = pathname === ADMIN_ROUTES.LOGIN;

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated && !isLoginPage) {
      router.replace(ADMIN_ROUTES.LOGIN);
      return;
    }

    if (isAuthenticated && isLoginPage) {
      router.replace(ADMIN_ROUTES.DASHBOARD);
    }
  }, [isHydrated, isAuthenticated, isLoginPage, router]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading admin session...
      </div>
    );
  }

  if (!isAuthenticated && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Redirecting to admin login...
      </div>
    );
  }

  if (isAuthenticated && isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Redirecting to admin dashboard...
      </div>
    );
  }

  return <>{children}</>;
}