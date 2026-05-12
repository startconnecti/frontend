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
import { useAdminPaymentsQuery } from '@/features/admin-payments';

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

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'>('all');
  const [page, setPage] = useState(1);

  const { data: paymentsData, isLoading, isError } = useAdminPaymentsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const statuses = ['all', 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !paymentsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading payments
          </TableCell>
        </TableRow>
      );
    }

    if (paymentsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No payments found
          </TableCell>
        </TableRow>
      );
    }

    return paymentsData.items.map(payment => (
      <TableRow key={payment.id}>
        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
        <TableCell className="font-medium">{formatCurrency(payment.amount, payment.currency)}</TableCell>
        <TableCell className="capitalize text-sm">{payment.method.replace(/_/g, ' ')}</TableCell>
        <TableCell>
          <AdminStatusBadge status={payment.status} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{payment.paidAt ? formatDate(payment.paidAt) : '-'}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader title="Payments Management" description="Track and manage all payment transactions." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search payment ID..."
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
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Paid At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && paymentsData && paymentsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {paymentsData.page} of {paymentsData.totalPages}
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
                onClick={() => setPage(Math.min(paymentsData.totalPages, page + 1))}
                disabled={page === paymentsData.totalPages}
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
