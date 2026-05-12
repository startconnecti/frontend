'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';

export default function SystemSettingsPage() {
  return (
    <>
      <AdminPageHeader
        title="System Settings"
        description="Configure platform-wide settings and configuration."
      />

      <Card className="p-12 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature Coming Soon</p>
          <p className="text-muted-foreground">
            System settings management is currently in development. Backend API integration will enable comprehensive platform configuration.
          </p>
        </div>
      </Card>
    </>
  );
}
