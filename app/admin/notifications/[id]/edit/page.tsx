'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EditNotificationPage({ params }: { params: { id: string } }) {
  return (
    <>
      <AdminPageHeader
        title="Edit Notification"
        description={`Edit notification ${params.id}`}
        backButton={
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card className="p-12 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature Coming Soon</p>
          <p className="text-muted-foreground">
            Notification editing is currently in development. Backend API integration will enable notification updates and management.
          </p>
        </div>
      </Card>
    </>
  );
}
