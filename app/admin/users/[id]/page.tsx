'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/lib/admin/mock-data';

interface PageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: PageProps) {
  const user = mockUsers.find(u => u.id === params.id);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">User not found</p>
          <Link href="/admin/users">
            <Button className="mt-4" variant="outline">Back to Users</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <AdminStatusBadge status={user.status} />
            </div>
          </Card>

          {/* Account Info */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Account Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge className="mt-2 capitalize">{user.role}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-2">
                    <AdminStatusBadge status={user.status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium">{user.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm font-medium">{user.lastLogin || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          {user.status === 'active' && (
            <AdminConfirmDialog
              title="Block User?"
              description="The user will not be able to access their account. They can contact support to restore access."
              actionLabel="Block User"
              actionVariant="destructive"
              triggerLabel="Block User"
              triggerVariant="destructive"
              onConfirm={() => console.log('User blocked')}
            />
          )}

          {user.status === 'blocked' && (
            <Button className="w-full bg-green-600 text-white hover:bg-green-700">
              Unblock User
            </Button>
          )}

          <Card className="p-6 bg-muted/50">
            <h4 className="mb-2 text-sm font-bold text-foreground">Account ID</h4>
            <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
