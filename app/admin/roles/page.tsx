'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, ShieldCheckIcon, CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PermissionGroup {
  module: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    approve?: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
  permissions: PermissionGroup[];
}

const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full access to all system modules and settings.',
    userCount: 2,
    createdAt: '2024-01-01',
    permissions: [
      { module: 'users', permissions: { read: true, write: true, delete: true } },
      { module: 'tutors', permissions: { read: true, write: true, delete: true, approve: true } },
      { module: 'bookings', permissions: { read: true, write: true, delete: true } },
      { module: 'sessions', permissions: { read: true, write: true, delete: true } },
      { module: 'payments', permissions: { read: true, write: true, delete: true } },
      { module: 'refunds', permissions: { read: true, write: true, delete: true } },
      { module: 'disputes', permissions: { read: true, write: true, delete: true } },
      { module: 'subjects', permissions: { read: true, write: true, delete: true } },
      { module: 'admins', permissions: { read: true, write: true, delete: true } },
      { module: 'notifications', permissions: { read: true, write: true, delete: true } },
      { module: 'audit logs', permissions: { read: true, write: false, delete: false } },
    ]
  },
  {
    id: '2',
    name: 'Moderator',
    description: 'Can manage users, tutors and disputes. No financial access.',
    userCount: 5,
    createdAt: '2024-02-15',
    permissions: [
      { module: 'users', permissions: { read: true, write: true, delete: false } },
      { module: 'tutors', permissions: { read: true, write: true, delete: false, approve: true } },
      { module: 'bookings', permissions: { read: true, write: false, delete: false } },
      { module: 'sessions', permissions: { read: true, write: false, delete: false } },
      { module: 'payments', permissions: { read: false, write: false, delete: false } },
      { module: 'disputes', permissions: { read: true, write: true, delete: false } },
      { module: 'notifications', permissions: { read: true, write: true, delete: false } },
    ]
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Financial records and payout management.',
    userCount: 3,
    createdAt: '2024-03-10',
    permissions: [
      { module: 'payments', permissions: { read: true, write: false, delete: false } },
      { module: 'refunds', permissions: { read: true, write: true, delete: false } },
      { module: 'payouts', permissions: { read: true, write: true, delete: false } },
    ]
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access for reporting and auditing.',
    userCount: 8,
    createdAt: '2024-04-20',
    permissions: [
      { module: 'users', permissions: { read: true, write: false, delete: false } },
      { module: 'tutors', permissions: { read: true, write: false, delete: false } },
      { module: 'bookings', permissions: { read: true, write: false, delete: false } },
      { module: 'audit logs', permissions: { read: true, write: false, delete: false } },
    ]
  }
];

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const PermissionIcon = ({ granted }: { granted: boolean }) => 
    granted ? <CheckCircle2Icon className="h-4 w-4 text-green-500" /> : <XCircleIcon className="h-4 w-4 text-muted-foreground/30" />;

  return (
    <>
      <AdminPageHeader
        title="Roles & Permissions"
        description="View system roles and their assigned permissions."
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Users</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ROLES.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-bold">{role.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[300px]">
                  {role.description}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{role.userCount}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(role.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setSelectedRole(role)}
                  >
                    <EyeIcon className="h-4 w-4" />
                    View Permissions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <Badge variant="secondary">RBAC Module</Badge>
            </div>
            <SheetTitle className="text-2xl font-bold">{selectedRole?.name}</SheetTitle>
            <SheetDescription>{selectedRole?.description}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6">
              {selectedRole?.permissions.map((group) => (
                <div key={group.module} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold capitalize">{group.module}</h4>
                    <Badge variant={Object.values(group.permissions).some(v => v) ? 'default' : 'secondary'}>
                      {Object.values(group.permissions).filter(v => v).length} Permissions
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">Read</span>
                      <PermissionIcon granted={group.permissions.read} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">Write</span>
                      <PermissionIcon granted={group.permissions.write} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-muted-foreground">Delete</span>
                      <PermissionIcon granted={group.permissions.delete} />
                    </div>
                    {group.permissions.approve !== undefined && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">Approve</span>
                        <PermissionIcon granted={group.permissions.approve} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
