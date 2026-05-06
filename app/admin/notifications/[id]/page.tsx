'use client';

import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockNotifications } from '@/lib/admin/mock-data';

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const notif = mockNotifications.find(n => n.id === params.id);

  if (!notif) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Notification not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{notif.title}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(notif.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link href={`/admin/notifications/${notif.id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Main Content */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Message</h2>
              <p className="text-foreground whitespace-pre-wrap">{notif.message}</p>
            </div>

            <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <p className="font-medium">{notif.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recipient Role</p>
                <p className="font-medium capitalize">{notif.recipientRole}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{notif.read ? 'Read' : 'Unread'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created At</p>
                <p className="font-medium">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Resource */}
        {notif.relatedResourceId && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Resource</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resource Type</span>
                <span className="font-medium">{notif.relatedResourceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resource ID</span>
                <span className="font-mono text-sm">{notif.relatedResourceId}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
