'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeftIcon, 
  SendIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  Loader2Icon,
  BellIcon,
  BarChart3Icon,
  UsersIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

export default function NotificationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    id: string;
    title: string;
    message: string;
    type: string;
    scope: string;
    status: string;
    createdAt: string;
    sentCount: number;
    openRate: string;
    clickRate: string;
  } | null>(null);

  useEffect(() => {
    // Simulate fetching sent notification data — replace with real query when API is ready
    setTimeout(() => {
      setData({
        id: Array.isArray(id) ? id[0] : id,
        title: 'Platform Maintenance Notice',
        message: 'Dear users, we will be performing scheduled maintenance on June 1st from 02:00 to 04:00 UTC. The platform will be temporarily unavailable during this time.',
        type: 'warning',
        scope: 'all',
        status: 'sent',
        createdAt: '2024-05-10T08:00:00Z',
        sentCount: 15420,
        openRate: '68.5%',
        clickRate: '12.4%'
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

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
        title="Announcement Details"
        description={`Delivery report for: ${data?.title}`}
      >
        <div className="flex gap-2">
          <Badge className="bg-green-500 h-8 px-3 gap-1">
            <CheckCircle2Icon className="h-3 w-3" />
            Successfully Delivered
          </Badge>
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Message Content</h3>
            <div className="p-6 border rounded-xl bg-muted/20">
              <h2 className="text-xl font-bold mb-4">{data?.title}</h2>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                {data?.message}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge variant="outline" className="capitalize">{data?.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Target</p>
                <Badge variant="secondary" className="capitalize">{data?.scope}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sent Date</p>
                <p className="text-sm font-medium">{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sent By</p>
                <p className="text-sm font-medium">System Admin</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5 text-primary" />
              Delivery Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Recipients</p>
                <p className="text-3xl font-bold">{data?.sentCount?.toLocaleString() ?? '-'}</p>
                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                  <UsersIcon className="h-3 w-3" />
                  100% Reach
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Open Rate</p>
                <p className="text-3xl font-bold text-blue-600">{data?.openRate}</p>
                <p className="text-[10px] text-muted-foreground">In-app & Email</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <p className="text-3xl font-bold text-amber-600">{data?.clickRate}</p>
                <p className="text-[10px] text-muted-foreground">Action buttons</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Delivery Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-muted">
              <div className="relative pl-8">
                <div className="absolute left-0 mt-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-background">
                  <CheckCircle2Icon className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-bold leading-none">Completed</p>
                <p className="text-[10px] text-muted-foreground mt-1">May 10, 08:05 AM</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 mt-1 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-background">
                  <SendIcon className="h-3 w-3 text-white" />
                </div>
                <p className="text-sm font-bold leading-none">Broadcasting</p>
                <p className="text-[10px] text-muted-foreground mt-1">May 10, 08:00 AM</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 mt-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center ring-4 ring-background">
                  <ClockIcon className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-sm font-bold leading-none text-muted-foreground">Scheduled</p>
                <p className="text-[10px] text-muted-foreground mt-1">May 09, 04:30 PM</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Need to re-send?</h3>
            <p className="text-xs text-muted-foreground mb-4">
              You can broadcast this announcement again to users who haven't opened it yet.
            </p>
            <Button variant="outline" className="w-full" disabled>Re-send Announcement</Button>
          </Card>
        </div>
      </div>
    </>
  );
}
