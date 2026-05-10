import { ReactNode } from 'react';
import { StudentSidebar } from '@/components/client/student-sidebar';
import { DashboardHeader } from '@/components/client/dashboard-header';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
