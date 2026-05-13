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
import { AdminEmptyState } from '@/components/admin/admin-empty-state';
import { UsersIcon, SearchIcon } from 'lucide-react';

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

  return (
    <>
      <AdminPageHeader
        title="Users Management"
        description="Manage platform users and their accounts."
      />

      <Card>
        <AdminBulkActions
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
        />

        <div className="border-b border-border px-6 py-4">
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
                setSelected(new Set());
              }}
              className="pl-9"
            />
          </div>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Checkbox disabled /></TableCell>
                    <TableCell className="h-12"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">
                    Failed to load users
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <AdminEmptyState 
                      icon={UsersIcon}
                      title="No users found"
                      description="We couldn't find any users matching your current filters."
                    />
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

                    <TableCell className="text-right">
                      <AdminRowActions
                        viewHref={ADMIN_ROUTES.USER_DETAIL(user.id)}
                        editHref={ADMIN_ROUTES.USER_EDIT(user.id)}
                        showEdit={true}
                        showDelete={false}
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
