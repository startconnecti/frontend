'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { StudentSidebar } from '@/components/client/student-sidebar';
import { DashboardHeader } from '@/components/client/dashboard-header';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useUIStore } from '@/stores/ui-store';

export default function StudentLayout({ children }: { children: ReactNode }) {
  const isMobileSidebarOpen = useUIStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useUIStore((state) => state.closeMobileSidebar);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <StudentSidebar />

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={(open) => !open && closeMobileSidebar()}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <StudentSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col lg:ml-64 relative min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
