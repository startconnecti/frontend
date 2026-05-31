'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  EyeIcon,
  MessageSquareIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminConversationsQuery } from '@/features/admin-conversations';
import { PAGINATION } from '@/constants/pagination';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

function formatHumanReadableDate(dateString: string | null): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) return '-';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (isToday) return `Today ${timeString}`;
    if (isYesterday) return `Yesterday ${timeString}`;

    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() === 1970) return '-';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '-';
  }
}

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminConversationsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  // Since backend doesn't have a status on conversation yet, it defaults to 'active'.
  const statuses = ['all', 'active'] as const;

  const conversations = data?.items || [];
  const total = data?.total || 0;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-destructive">
            Failed to load conversations. Please try again.
          </TableCell>
        </TableRow>
      );
    }

    if (conversations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <AdminEmptyState
              icon={MessageSquareIcon}
              title="No conversations found"
              description="Monitor user interactions and moderate conversations."
            />
          </TableCell>
        </TableRow>
      );
    }

    return conversations.map((conv) => (
      <TableRow key={conv.id}>
        <TableCell className="font-mono text-xs text-muted-foreground">
          {conv.id.substring(0, 8)}
        </TableCell>
        <TableCell>
          <div className="font-medium text-sm">{conv.studentName}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium text-sm">{conv.tutorName}</div>
        </TableCell>
        <TableCell>
          <AdminStatusBadge status={conv.status} type="user" />
        </TableCell>
        <TableCell className="text-sm">
          {formatHumanReadableDate(conv.latestMessageAt)}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(conv.createdAt)}
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ADMIN_ROUTES.CONVERSATION_DETAIL(conv.id)}>
              <EyeIcon className="h-4 w-4" />
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader
        title="Manage Conversations"
        description="Monitor user interactions and moderate conversations."
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student, tutor, or message..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              {statuses.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? 'default' : 'outline'}
                  size="sm"
                  className="capitalize"
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Latest Activity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>

          {!isLoading && data && data.totalPages > 1 && (
            <div className="border-t border-border px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages} ({total} total)
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
                  onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                  disabled={page === data.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
