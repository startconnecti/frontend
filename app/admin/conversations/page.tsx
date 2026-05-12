'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';

export default function ConversationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Manage Conversations"
        description="View and monitor user conversations for support and moderation."
      />

      <Card className="p-12 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature Coming Soon</p>
          <p className="text-muted-foreground">
            Conversations management is currently in development. Backend API integration will enable real-time conversation monitoring and moderation features.
          </p>
        </div>
      </Card>
    </>
  );
}
