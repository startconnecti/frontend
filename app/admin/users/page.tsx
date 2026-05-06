'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Lock, Unlock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/admin/mock-data';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleTabs = [
    { value: 'all', label: 'All', count: mockUsers.length },
    { value: 'student', label: 'Students', count: mockUsers.filter(u => u.role === 'student').length },
    { value: 'tutor', label: 'Tutors', count: mockUsers.filter(u => u.role === 'tutor').length },
    { value: 'admin', label: 'Admins', count: mockUsers.filter(u => u.role === 'admin').length },
  ];

  return (
    <>
      <AdminPageHeader title="Users Management" description="Manage platform users and their accounts." />

      <Card>
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
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {user.status === 'active' ? (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Lock className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
}

import { Badge } from '@/components/ui/badge';
