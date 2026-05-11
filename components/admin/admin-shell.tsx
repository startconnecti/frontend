'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { AdminSidebar } from './admin-sidebar';
import { AdminHeader } from './admin-header';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === ADMIN_ROUTES.LOGIN;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <div className="flex flex-1 flex-col lg:ml-64">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}