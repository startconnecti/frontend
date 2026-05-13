'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  SearchIcon, 
  EyeIcon, 
  FilterIcon,
  MessageSquareIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminConversationsQuery } from '@/features/admin-conversations';
import { PAGINATION } from '@/constants/pagination';
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { Skeleton } from '@/components/ui/skeleton';

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

  const statuses = ['all', 'active', 'archived', 'flagged', 'closed'] as const;

  const conversations = data?.items || [];
  const total = data?.total || 0;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-10 w-48" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-64" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ));
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-destructive">
            Failed to load conversations. Please try again.
          </TableCell>
        </TableRow>
      );
    }

    if (conversations.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="p-0">
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
        <TableCell>
          <div className="flex flex-col gap-1">
            <div className="font-bold flex items-center gap-2">
              {conv.participants[0]?.fullName || 'Unknown'} 
              <span className="text-muted-foreground text-xs font-normal">and</span>
              {conv.participants[1]?.fullName || 'Unknown'}
            </div>
            <div className="flex gap-2">
              {conv.participants.map((p) => (
                <Badge key={p.id} variant="secondary" className="text-[10px] h-4 px-1 capitalize">
                  {p.role}
                </Badge>
              ))}
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell max-w-[300px]">
          <div className="text-sm truncate">
            {conv.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 mr-2">
                {conv.unreadCount}
              </span>
            )}
            <span className={conv.unreadCount > 0 ? 'font-bold' : 'text-muted-foreground'}>
              {conv.lastMessage?.content || 'No messages yet'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant={
              conv.status === 'flagged' ? 'destructive' : 
              conv.status === 'archived' ? 'outline' : 'default'
            }
            className="capitalize"
          >
            {conv.status}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(conv.lastActivityAt)}
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
              placeholder="Search participants..." 
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
            <Badge variant="outline">{total} Conversations</Badge>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participants</TableHead>
                <TableHead className="hidden md:table-cell">Latest Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
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
                Page {data.page} of {data.totalPages}
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
