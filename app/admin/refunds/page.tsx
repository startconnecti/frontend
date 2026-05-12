'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminRefundsQuery } from '@/features/admin-refunds';

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  } catch {
    return `${amount} ${currency || 'USD'}`;
  }
}

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

export default function RefundsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing' | 'processed' | 'failed' | 'cancelled'>('all');
  const [page, setPage] = useState(1);

  const { data: refundsData, isLoading, isError } = useAdminRefundsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const statuses = ['all', 'pending', 'approved', 'rejected', 'processing', 'processed', 'failed', 'cancelled'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !refundsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading refunds
          </TableCell>
        </TableRow>
      );
    }

    if (refundsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No refunds found
          </TableCell>
        </TableRow>
      );
    }

    return refundsData.items.map(refund => (
      <TableRow key={refund.id}>
        <TableCell className="font-mono text-sm">{refund.id}</TableCell>
        <TableCell className="font-mono text-sm">{refund.paymentId}</TableCell>
        <TableCell className="font-medium">{formatCurrency(refund.amount, refund.currency)}</TableCell>
        <TableCell className="text-sm capitalize">{refund.reason.replace(/_/g, ' ')}</TableCell>
        <TableCell>
          <AdminStatusBadge status={refund.status} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(refund.requestedAt)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader title="Refunds Management" description="Review and process refund requests." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search refund ID..."
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
                <TableHead>Refund ID</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && refundsData && refundsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {refundsData.page} of {refundsData.totalPages}
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
                onClick={() => setPage(Math.min(refundsData.totalPages, page + 1))}
                disabled={page === refundsData.totalPages}
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
