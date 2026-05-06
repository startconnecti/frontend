'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/admin/mock-data';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const roleTabs = [
    { value: 'all', label: 'All', count: mockUsers.length },
    { value: 'student', label: 'Students', count: mockUsers.filter(u => u.role === 'student').length },
    { value: 'tutor', label: 'Tutors', count: mockUsers.filter(u => u.role === 'tutor').length },
    { value: 'admin', label: 'Admins', count: mockUsers.filter(u => u.role === 'admin').length },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(paginatedUsers.map(u => u.id)));
    } else {
      setSelected(new Set());
    }
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
          href: '/admin/users/create',
        }}
      />

      <Card>
        <AdminBulkActions 
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
          onBulkDelete={handleBulkDelete}
        />

        {/* Search Bar */}
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <Tabs value={selectedRole} onValueChange={(val) => {
            setSelectedRole(val);
            setPage(1);
            setSelected(new Set());
          }} className="w-full">
            <div className="px-6">
              <TabsList className="gap-2">
                {roleTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="relative">
                    {tab.label}
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.size > 0 && selected.size === paginatedUsers.length}
                    onCheckedChange={handleSelectAll}
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
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(user.id)}
                        onCheckedChange={(checked) => handleSelectOne(user.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastLogin || '-'}</TableCell>
                    <TableCell>
                      <AdminRowActions
                        viewHref={`/admin/users/${user.id}`}
                        editHref={`/admin/users/${user.id}/edit`}
                        onDelete={() => handleBulkDelete()}
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
          total={filteredUsers.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </>
  );
}

import { Badge } from '@/components/ui/badge';
