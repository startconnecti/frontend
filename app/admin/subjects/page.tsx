'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminSubjectsQuery } from '@/features/admin-subjects';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

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

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);

  const { data: subjectsData, isLoading, isError } = useAdminSubjectsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const statuses = ['all', 'active', 'inactive'] as const;

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !subjectsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading subjects
          </TableCell>
        </TableRow>
      );
    }

    if (subjectsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No subjects found
          </TableCell>
        </TableRow>
      );
    }

    return subjectsData.items.map(subject => (
      <TableRow key={subject.id}>
        <TableCell className="font-medium">{subject.name}</TableCell>
        <TableCell className="font-mono text-sm">{subject.slug}</TableCell>
        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{subject.description}</TableCell>
        <TableCell>
          <AdminStatusBadge status={subject.status} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(subject.createdAt)}</TableCell>
        <TableCell className="text-right">
          {/* No Delete: backend DELETE not implemented. Edit is wired to real API. */}
          <AdminRowActions
            viewHref={ADMIN_ROUTES.SUBJECT_EDIT(subject.id)}
            editHref={ADMIN_ROUTES.SUBJECT_EDIT(subject.id)}
            showView={false}
            showEdit={true}
            showDelete={false}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <AdminPageHeader
        title="Subjects Management"
        description="Manage available tutoring subjects and categories."
        action={{ label: 'Create Subject', href: ADMIN_ROUTES.SUBJECT_CREATE }}
      />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <FilterIcon className="h-4 w-4 text-muted-foreground mr-2" />
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
                <TableHead>Subject</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && subjectsData && subjectsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {subjectsData.page} of {subjectsData.totalPages}
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
                onClick={() => setPage(Math.min(subjectsData.totalPages, page + 1))}
                disabled={page === subjectsData.totalPages}
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
