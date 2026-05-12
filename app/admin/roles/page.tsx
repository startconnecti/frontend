'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

export default function RolesPage() {
  return (
    <>
      <AdminPageHeader
        title="Roles & Permissions"
        description="Manage admin roles and their permissions."
      />

      <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <InfoIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Feature not available yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The Roles & Permissions management module is currently under development. 
            This feature will allow super admins to define custom access levels for other administrative staff.
          </p>
        </div>
      </Card>
    </>
  );
}
