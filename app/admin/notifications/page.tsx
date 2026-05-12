'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { BellIcon } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Manage Notifications"
        description="View system notifications sent to users."
      />

      <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <BellIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Feature not available yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The System Notifications module is currently being updated to support multi-channel delivery (Email, SMS, Push).
            We expect this feature to be restored shortly.
          </p>
        </div>
      </Card>
    </>
  );
}
