'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockNotifications } from '@/lib/admin/mock-data';

export default function EditNotificationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const notif = mockNotifications.find(n => n.id === params.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!notif) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Notification not found</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push(`/admin/notifications/${notif.id}`);
  };

  return (
    <>
      <AdminPageHeader
        title="Edit Notification"
        description={`Edit notification ${notif.id}`}
        backButton={
          <Link href={`/admin/notifications/${notif.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" defaultValue={notif.title} />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select defaultValue={notif.type}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="session_updated">Session Updated</SelectItem>
                <SelectItem value="session_reminder">Session Reminder</SelectItem>
                <SelectItem value="payment_updated">Payment Updated</SelectItem>
                <SelectItem value="refund_updated">Refund Updated</SelectItem>
                <SelectItem value="system_announcement">System Announcement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" defaultValue={notif.message} rows={6} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href={`/admin/notifications/${notif.id}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
