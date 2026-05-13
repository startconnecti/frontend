'use client';

import { useState } from 'react';
import { Shield, SearchIcon } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGINATION } from '@/constants/pagination';
import { useAdminAdminsQuery } from '@/features/admin-admins';
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

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: adminsData, isLoading, isError } = useAdminAdminsQuery({
    keyword: searchQuery || undefined,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !adminsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading admins
          </TableCell>
        </TableRow>
      );
    }

    if (adminsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No admin accounts found
          </TableCell>
        </TableRow>
      );
    }

    return adminsData.items.map(admin => (
      <TableRow key={admin.id}>
        <TableCell className="font-medium">{admin.fullName}</TableCell>
        <TableCell className="text-sm">{admin.email}</TableCell>
        <TableCell>
          <Badge variant="outline" className="flex w-fit gap-1 capitalize">
            <Shield className="h-3 w-3" />
            {admin.role.replace(/_/g, ' ')}
          </Badge>
        </TableCell>
        <TableCell>
          <AdminStatusBadge status={admin.status} />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{formatDate(admin.createdAt)}</TableCell>
        <TableCell className="text-right">
          <AdminRowActions
            viewHref={ADMIN_ROUTES.ADMIN_EDIT(admin.id)}
            editHref={ADMIN_ROUTES.ADMIN_EDIT(admin.id)}
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
        title="Admin Accounts"
        description="Manage platform administrators and their permissions."
        action={{ label: 'Add Admin', href: ADMIN_ROUTES.ADMIN_CREATE }}
      />

      <Card>
        {/* Search */}
        <div className="border-b border-border px-6 py-4">
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
        {!isLoading && adminsData && adminsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {adminsData.page} of {adminsData.totalPages}
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
                onClick={() => setPage(Math.min(adminsData.totalPages, page + 1))}
                disabled={page === adminsData.totalPages}
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
