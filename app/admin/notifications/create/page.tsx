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

export default function CreateNotificationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push('/admin/notifications');
  };

  return (
    <>
      <AdminPageHeader
        title="Create Notification"
        description="Send a new system notification to users."
        backButton={
          <Link href="/admin/notifications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Recipient Type */}
          <div className="space-y-2">
            <Label htmlFor="recipient-type">Recipient Type</Label>
            <Select defaultValue="all">
              <SelectTrigger id="recipient-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="student">All Students</SelectItem>
                <SelectItem value="tutor">All Tutors</SelectItem>
                <SelectItem value="admin">All Admins</SelectItem>
                <SelectItem value="specific">Specific User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Notification Type</Label>
            <Select defaultValue="system_announcement">
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Notification title..." />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Notification message..." rows={6} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Notification'}
            </Button>
            <Link href="/admin/notifications">
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
