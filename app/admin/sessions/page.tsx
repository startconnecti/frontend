'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminSessionsQuery } from '@/features/admin-sessions';

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

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [page, setPage] = useState(1);

  const { data: sessionsData, isLoading, isError } = useAdminSessionsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const statuses = ['all', 'scheduled', 'ongoing', 'completed', 'cancelled'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-10" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !sessionsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading sessions
          </TableCell>
        </TableRow>
      );
    }

    if (sessionsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No sessions found
          </TableCell>
        </TableRow>
      );
    }

    return sessionsData.items.map(session => (
      <TableRow key={session.id}>
        <TableCell className="font-mono text-sm">{session.id}</TableCell>
        <TableCell>{session.subjectName}</TableCell>
        <TableCell className="text-sm">{formatDate(session.startTime)}</TableCell>
        <TableCell>
          <AdminStatusBadge status={session.status} />
        </TableCell>
        <TableCell>
          {session.recordingUrl ? (
            <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
              View
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="sm" disabled title="Session details not available">
            <Eye className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader title="Sessions Management" description="Monitor and manage all learning sessions." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search session ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {statuses.map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && sessionsData && sessionsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {sessionsData.page} of {sessionsData.totalPages}
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
                onClick={() => setPage(Math.min(sessionsData.totalPages, page + 1))}
                disabled={page === sessionsData.totalPages}
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
