'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockAdmins } from '@/lib/admin/mock-data';

export default function AdminsPage() {
  return (
    <>
      <AdminPageHeader
        title="Admin Accounts"
        description="Manage platform administrators and their permissions."
        action={{
          label: 'Create Admin',
          onClick: () => console.log('Create admin'),
        }}
      />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No admin accounts found
                  </TableCell>
                </TableRow>
              ) : (
                mockAdmins.map(admin => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell className="text-sm">{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex w-fit gap-1">
                        <Shield className="h-3 w-3" />
                        {admin.role.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={admin.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{admin.createdAt}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
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
