'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { PublicHeader } from '@/components/client/public-header';
import { PublicFooter } from '@/components/client/public-footer';
import { StudentSidebar } from '@/components/client/student-sidebar';
import { TutorSidebar } from '@/components/client/tutor-sidebar';
import { DashboardHeader } from '@/components/client/dashboard-header';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useUIStore } from '@/stores/ui-store';
import { LoadingState } from '@/components/shared/loading-state';

export default function TutorDetailLayout({ children }: { children: ReactNode }) {
  const { user, isHydrated } = useAuthStore();
  const isMobileSidebarOpen = useUIStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState type="page" />
      </div>
    );
  }

  if (user?.role === 'student') {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <StudentSidebar />
        <Sheet open={isMobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <VisuallyHidden>
              <SheetTitle>Student Sidebar Menu</SheetTitle>
            </VisuallyHidden>
            <StudentSidebar isMobile />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 flex-col lg:ml-64 relative min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (user?.role === 'tutor') {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <TutorSidebar />
        <Sheet open={isMobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <VisuallyHidden>
              <SheetTitle>Tutor Sidebar Menu</SheetTitle>
            </VisuallyHidden>
            <TutorSidebar isMobile />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 flex-col lg:ml-64 relative min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
