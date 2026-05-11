'use client';

import { useState } from 'react';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { AdminUserRole, useAdminUsersQuery } from '@/features/admin-users';
import { PAGINATION } from '@/constants/pagination';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | AdminUserRole>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const queryParams = {
    keyword: searchQuery.trim() || undefined,
    role: selectedRole === 'all' ? undefined : selectedRole,
    page,
    limit: pageSize,
  };

  const { data, isLoading, isError } = useAdminUsersQuery(queryParams);

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  const roleTabs = [
    { value: 'all' as const, label: 'All' },
    { value: 'student' as const, label: 'Students' },
    { value: 'tutor' as const, label: 'Tutors' },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(users.map((user) => user.id)));
      return;
    }

    setSelected(new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selected);

    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }

    setSelected(newSelected);
  };

  const handleBulkDelete = () => {
    setSelected(new Set());
  };

  return (
    <>
      <AdminPageHeader
        title="Users Management"
        description="Manage platform users and their accounts."
        action={{
          label: 'Create User',
          href: ADMIN_ROUTES.USER_CREATE,
        }}
      />

      <Card>
        <AdminBulkActions
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
          onBulkDelete={handleBulkDelete}
        />

        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
              setSelected(new Set());
            }}
            className="max-w-sm"
          />
        </div>

        <div className="border-b border-border">
          <Tabs
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value as 'all' | AdminUserRole);
              setPage(1);
              setSelected(new Set());
            }}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="gap-2">
                {roleTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="relative">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={users.length > 0 && selected.size === users.length}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">
                    Failed to load users
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(user.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(user.id, Boolean(checked))
                        }
                      />
                    </TableCell>

                    <TableCell className="font-medium">{user.fullName || '-'}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <AdminStatusBadge status={user.status} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : '-'}
                    </TableCell>

                    <TableCell>
                      <AdminRowActions
                        viewHref={ADMIN_ROUTES.USER_DETAIL(user.id)}
                        editHref={ADMIN_ROUTES.USER_EDIT(user.id)}
                        onDelete={handleBulkDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <AdminPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
            setSelected(new Set());
          }}
        />
      </Card>
    </>
  );
}