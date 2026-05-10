import { ReactNode } from 'react';
import { TutorSidebar } from '@/components/client/tutor-sidebar';
import { DashboardHeader } from '@/components/client/dashboard-header';

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <TutorSidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
