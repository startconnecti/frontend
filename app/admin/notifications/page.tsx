'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminNotificationsQuery } from '@/features/admin-notifications';

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
      return '-';
    }
    return date.toLocaleString();
  } catch {
    return '-';
  }
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [page, setPage] = useState(1);

  const { data: notificationsData, isLoading, isError } = useAdminNotificationsQuery({
    keyword: searchQuery || undefined,
    type: typeFilter === 'all' ? undefined : typeFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const types = ['all', 'info', 'warning', 'error', 'success'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !notificationsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading notifications
          </TableCell>
        </TableRow>
      );
    }

    if (notificationsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No notifications found
          </TableCell>
        </TableRow>
      );
    }

    return notificationsData.items.map(notif => (
      <TableRow key={notif.id}>
        <TableCell className="font-mono text-sm">{notif.id}</TableCell>
        <TableCell className="font-medium">{notif.title}</TableCell>
        <TableCell className="text-sm capitalize">{notif.type}</TableCell>
        <TableCell className="text-sm capitalize">{notif.recipientRole}</TableCell>
        <TableCell>
          <span className={`text-xs px-2 py-1 rounded ${notif.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
            {notif.read ? 'Read' : 'Unread'}
          </span>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(notif.createdAt)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader
        title="Manage Notifications"
        description="View system notifications sent to users."
      />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {types.map(type => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTypeFilter(type);
                  setPage(1);
                }}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && notificationsData && notificationsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {notificationsData.page} of {notificationsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(notificationsData.totalPages, page + 1))}
                disabled={page === notificationsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
