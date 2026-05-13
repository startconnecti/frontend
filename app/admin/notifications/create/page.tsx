'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChevronLeftIcon, 
  SendIcon, 
  EyeIcon, 
  AlertCircleIcon,
  BellIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { Badge } from '@/components/ui/badge';

export default function NotificationCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    scope: 'all',
    targetUserId: ''
  });

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.NOTIFICATIONS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Notification Center
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Create System Announcement"
        description="Draft a new notification to be broadcasted to users."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Announcement Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Platform Maintenance scheduled for June 1st"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select 
                    defaultValue="info" 
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="success">Success / New Feature</SelectItem>
                      <SelectItem value="warning">Warning / Alert</SelectItem>
                      <SelectItem value="error">Critical / Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recipient Scope</Label>
                  <Select 
                    defaultValue="all"
                    onValueChange={(val) => setFormData({ ...formData, scope: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="tutors">Tutors Only</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                      <SelectItem value="individual">Individual User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.scope === 'individual' && (
                <div className="space-y-2">
                  <Label htmlFor="userId">Target User ID</Label>
                  <Input 
                    id="userId" 
                    placeholder="e.g. usr_123456"
                    value={formData.targetUserId}
                    onChange={(e) => setFormData({ ...formData, targetUserId: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea 
                  id="message" 
                  placeholder="Describe the announcement in detail..."
                  className="min-h-[200px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground italic">
                  Markdown support is enabled for message content.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button">Save Draft</Button>
                <Button className="gap-2" disabled>
                  <SendIcon className="h-4 w-4" />
                  Schedule Broadcast
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground">
                * Broadcasting is disabled until the backend delivery service is restored.
              </p>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              Live Preview
            </h3>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground mb-4 italic">
                This is how the notification will appear in the user's inbox:
              </p>
              <div className="p-4 border rounded-xl bg-card shadow-sm border-primary/20">
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    formData.type === 'error' ? 'bg-destructive/10 text-destructive' :
                    formData.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    formData.type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <BellIcon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="font-bold text-sm truncate">{formData.title || 'Untitled Announcement'}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {formData.message || 'Announcement content will appear here...'}
                    </p>
                    <p className="text-[10px] text-muted-foreground pt-1">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50/30 border-blue-100">
            <div className="flex gap-3">
              <AlertCircleIcon className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-blue-900">Broadcast Guidelines</p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc pl-4">
                  <li>Keep titles concise and action-oriented.</li>
                  <li>Use "Critical" type only for system outages.</li>
                  <li>Targeted messages reach users via Email and In-app.</li>
                  <li>Broadcasts to "All Users" may take up to 5 minutes to complete.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
