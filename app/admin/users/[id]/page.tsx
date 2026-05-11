'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Mail, Phone } from 'lucide-react';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminUserDetailQuery,
  useBlockAdminUserMutation,
  useUnblockAdminUserMutation,
} from '@/features/admin-users';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function UserDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-3" />
          <Skeleton className="h-4 w-64 mb-2" />
          <Skeleton className="h-4 w-40" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useAdminUserDetailQuery(userId);
  const blockMutation = useBlockAdminUserMutation(userId);
  const unblockMutation = useUnblockAdminUserMutation(userId);

  const isMutating = blockMutation.isPending || unblockMutation.isPending;

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href={ADMIN_ROUTES.USERS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
        </div>
        <UserDetailSkeleton />
      </>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">
            {isError ? 'Failed to load user' : 'User not found'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isError
              ? 'An error occurred while loading this user. Please try again.'
              : 'This user does not exist or may have been removed.'}
          </p>
          <Link href={ADMIN_ROUTES.USERS}>
            <Button className="mt-4" variant="outline">
              Back to Users
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lastLoginDate = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ADMIN_ROUTES.USERS}>
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
                <h2 className="text-2xl font-bold text-foreground">
                  {user.fullName || 'Unknown User'}
                </h2>
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
                    <p className="text-sm font-medium">{joinedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Login</p>
                    <p className="text-sm font-medium">{lastLoginDate ?? '-'}</p>
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
              triggerLabel={isMutating ? 'Processing…' : 'Block User'}
              triggerVariant="destructive"
              onConfirm={() => blockMutation.mutate()}
            />
          )}

          {user.status === 'blocked' && (
            <AdminConfirmDialog
              title="Unblock User?"
              description="The user will regain access to their account immediately."
              actionLabel="Unblock User"
              actionVariant="default"
              triggerLabel={isMutating ? 'Processing…' : 'Unblock User'}
              triggerVariant="outline"
              onConfirm={() => unblockMutation.mutate()}
            />
          )}

          <Card className="p-6 bg-muted/50">
            <h4 className="mb-2 text-sm font-bold text-foreground">Account ID</h4>
            <p className="font-mono text-xs text-muted-foreground break-all">{user.id}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
