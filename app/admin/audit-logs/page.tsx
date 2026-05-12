'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminAuditLogsQuery } from '@/features/admin-audit-logs';

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

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading, isError } = useAdminAuditLogsQuery({
    keyword: searchQuery || undefined,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !logsData) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-destructive">
            Error loading audit logs
          </TableCell>
        </TableRow>
      );
    }

    if (logsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
            No audit logs found
          </TableCell>
        </TableRow>
      );
    }

    return logsData.items.map(log => (
      <TableRow key={log.id}>
        <TableCell className="font-mono text-xs">{log.id}</TableCell>
        <TableCell className="text-sm">{log.actorEmail}</TableCell>
        <TableCell>
          <span className="text-sm capitalize px-2 py-1 rounded bg-muted">
            {log.action}
          </span>
        </TableCell>
        <TableCell className="text-sm">{log.entityType}</TableCell>
        <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
        <TableCell className="text-xs text-muted-foreground">{log.ipAddress}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(log.createdAt)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader
        title="Audit Logs"
        description="Immutable audit trail of all admin and system actions."
      />

      <Card>
        {/* Search */}
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by actor email or entity ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && logsData && logsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {logsData.page} of {logsData.totalPages}
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
                onClick={() => setPage(Math.min(logsData.totalPages, page + 1))}
                disabled={page === logsData.totalPages}
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
