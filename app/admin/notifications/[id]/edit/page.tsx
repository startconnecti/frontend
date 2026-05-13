'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  SaveIcon, 
  EyeIcon, 
  Loader2Icon,
  BellIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { toast } from 'sonner';

export default function NotificationEditPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    scope: 'all',
  });

  useEffect(() => {
    // Simulate fetching draft data
    setTimeout(() => {
      setFormData({
        title: 'Urgent Security Update',
        message: 'We have updated our security protocols. Please review the new terms.',
        type: 'error',
        scope: 'all',
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Notification update API call placeholder', {
      description: `This would call PATCH /api/v1/admin/notifications/${id} in production.`
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        title="Edit Announcement Draft"
        description={`Modifying draft ID: ${id}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Announcement Title</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select 
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val as any })}
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
                    value={formData.scope}
                    onValueChange={(val) => setFormData({ ...formData, scope: val as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="tutors">Tutors Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Content</Label>
                <Textarea 
                  id="message" 
                  className="min-h-[200px]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" asChild>
                  <Link href={ADMIN_ROUTES.NOTIFICATIONS}>Discard Changes</Link>
                </Button>
                <Button className="gap-2" type="submit">
                  <SaveIcon className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              Live Preview
            </h3>
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
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
