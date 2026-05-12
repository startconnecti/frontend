'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminDisputesQuery } from '@/features/admin-disputes';

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

export default function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'under_review' | 'resolved' | 'rejected' | 'cancelled'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [page, setPage] = useState(1);

  const { data: disputesData, isLoading, isError } = useAdminDisputesQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    priority: priorityFilter === 'all' ? undefined : priorityFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const openCount = disputesData?.items.filter(d => d.status === 'open').length ?? 0;
  const statuses = ['all', 'open', 'under_review', 'resolved', 'rejected', 'cancelled'] as const;
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !disputesData) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-destructive">
            Error loading disputes
          </TableCell>
        </TableRow>
      );
    }

    if (disputesData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
            No disputes found
          </TableCell>
        </TableRow>
      );
    }

    return disputesData.items.map(dispute => (
      <TableRow key={dispute.id}>
        <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
        <TableCell className="max-w-xs truncate">{dispute.subject}</TableCell>
        <TableCell>
          <AdminStatusBadge status={dispute.status} />
        </TableCell>
        <TableCell>
          <AdminStatusBadge status={dispute.priority} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(dispute.createdAt)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader title="Disputes Management" description={`Manage disputes and resolutions. ${openCount} open dispute${openCount !== 1 ? 's' : ''}.`} />

      {openCount > 0 && (
        <Card className="mb-6 border-l-4 border-l-destructive bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Action Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You have {openCount} open dispute{openCount !== 1 ? 's' : ''} awaiting resolution.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search dispute ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="space-y-3">
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
                  {status.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {priorities.map(priority => (
                <Button
                  key={priority}
                  variant={priorityFilter === priority ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setPriorityFilter(priority);
                    setPage(1);
                  }}
                  className="capitalize"
                >
                  {priority}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && disputesData && disputesData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {disputesData.page} of {disputesData.totalPages}
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
                onClick={() => setPage(Math.min(disputesData.totalPages, page + 1))}
                disabled={page === disputesData.totalPages}
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
