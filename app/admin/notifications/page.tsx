'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusIcon, 
  SearchIcon, 
  BellIcon, 
  SendIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  AlertCircleIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

interface NotificationTemplate {
  id: string;
  title: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipientScope: 'all' | 'students' | 'tutors' | 'admins' | 'individual';
  status: 'sent' | 'scheduled' | 'draft';
  createdAt: string;
  sentCount: number;
}

const MOCK_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    title: 'Platform Maintenance Notice',
    type: 'warning',
    recipientScope: 'all',
    status: 'sent',
    createdAt: '2024-05-10T08:00:00Z',
    sentCount: 15420
  },
  {
    id: '2',
    title: 'New Feature: Group Sessions',
    type: 'success',
    recipientScope: 'tutors',
    status: 'scheduled',
    createdAt: '2024-05-15T10:00:00Z',
    sentCount: 0
  },
  {
    id: '3',
    title: 'Profile Verification Required',
    type: 'info',
    recipientScope: 'tutors',
    status: 'sent',
    createdAt: '2024-05-01T09:00:00Z',
    sentCount: 450
  },
  {
    id: '4',
    title: 'Urgent Security Update',
    type: 'error',
    recipientScope: 'all',
    status: 'draft',
    createdAt: '2024-05-12T14:30:00Z',
    sentCount: 0
  }
];

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const StatusBadge = ({ status }: { status: NotificationTemplate['status'] }) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500 hover:bg-green-600 gap-1"><CheckCircle2Icon className="h-3 w-3" /> Sent</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="gap-1 text-blue-600 border-blue-200 bg-blue-50"><ClockIcon className="h-3 w-3" /> Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline" className="gap-1"><EditIcon className="h-3 w-3" /> Draft</Badge>;
    }
  };

  const TypeBadge = ({ type }: { type: NotificationTemplate['type'] }) => {
    switch (type) {
      case 'info': return <Badge variant="outline">Info</Badge>;
      case 'warning': return <Badge variant="outline" className="text-amber-600 border-amber-200">Warning</Badge>;
      case 'error': return <Badge variant="outline" className="text-destructive border-destructive/20">Error</Badge>;
      case 'success': return <Badge variant="outline" className="text-green-600 border-green-200">Success</Badge>;
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Admin Notification Center"
        description="Broadcast announcements and manage system notifications."
        action={
          <Button asChild className="gap-2">
            <Link href={ADMIN_ROUTES.NOTIFICATION_CREATE}>
              <PlusIcon className="h-4 w-4" />
              Create Announcement
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search announcements..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-muted/50">Total Sent: 15,870</Badge>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent / Scheduled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TEMPLATES.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">{item.title}</TableCell>
                  <TableCell><TypeBadge type={item.type} /></TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{item.recipientScope}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.sentCount > 0 && <span className="text-[10px]">Delivered to {item.sentCount} users</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`${ADMIN_ROUTES.NOTIFICATIONS}/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                            <EyeIcon className="h-4 w-4" />
                            View Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`${ADMIN_ROUTES.NOTIFICATIONS}/${item.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                            <EditIcon className="h-4 w-4" />
                            Edit Draft
                          </Link>
                        </DropdownMenuItem>
                        {item.status === 'draft' && (
                          <DropdownMenuItem className="flex items-center gap-2 text-primary focus:text-primary">
                            <SendIcon className="h-4 w-4" />
                            Send Now
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="p-4 bg-muted/20 border-dashed flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <BellIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Scheduled Today</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </Card>
          <Card className="p-4 bg-muted/20 border-dashed flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <SendIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sent (Last 30d)</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </Card>
          <Card className="p-4 bg-muted/20 border-dashed flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Bounced Email Rate</p>
              <p className="text-xl font-bold">0.42%</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
