'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { PAGINATION } from '@/constants/pagination';
import {
  AdminUserRole,
  useAdminUsersQuery,
  useBlockAdminUserMutation,
  useUnblockAdminUserMutation,
} from '@/features/admin-users';
import type { AdminUser } from '@/features/admin-users';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Ban, ShieldCheck, Search } from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatLastLogin(dateString: string | null | undefined): string {
  if (!dateString) return 'Never';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime()) || d.getFullYear() === 1970) return 'Never';
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { dateStyle: 'medium' });
  } catch {
    return 'Never';
  }
}

// ─── role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: AdminUserRole }) {
  const map: Record<AdminUserRole, { label: string; className: string }> = {
    student: {
      label: 'Student',
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-transparent',
    },
    tutor: {
      label: 'Tutor',
      className: 'bg-violet-100 text-violet-800 hover:bg-violet-100/80 border-transparent',
    },
  };
  const cfg = map[role] ?? { label: role, className: '' };
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

// ─── user column: name + email ────────────────────────────────────────────────

function UserCell({ user }: { user: AdminUser }) {
  // The list API does not return fullName — only the detail endpoint does.
  // We display email as the primary identifier and show fullName when present.
  const displayName = user.fullName && user.fullName !== '-' ? user.fullName : null;

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-sm font-medium text-foreground truncate">
        {displayName ?? 'Unknown User'}
      </span>
      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
    </div>
  );
}

// ─── per-row action cell ──────────────────────────────────────────────────────
// Each row gets its own component so hooks bind to the correct userId.

function UserActionsCell({ userId, status }: { userId: string; status: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: blockUser, isPending: isBlocking } = useBlockAdminUserMutation(userId);
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockAdminUserMutation(userId);

  const handleBlock = () => {
    blockUser(undefined, {
      onSuccess: () => toast({ title: 'User blocked successfully.' }),
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'An error occurred';
        toast({ title: 'Failed to block user', description: msg, variant: 'destructive' });
      },
    });
  };

  const handleUnblock = () => {
    unblockUser(undefined, {
      onSuccess: () => toast({ title: 'User unblocked successfully.' }),
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'An error occurred';
        toast({ title: 'Failed to unblock user', description: msg, variant: 'destructive' });
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push(ADMIN_ROUTES.USER_DETAIL(userId))}
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {status === 'active' && (
        <AdminConfirmDialog
          title="Block User"
          description="Are you sure you want to block this user? They will immediately lose access to the platform."
          actionLabel="Block User"
          actionVariant="destructive"
          onConfirm={handleBlock}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={isBlocking}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
            title="Block"
          >
            <Ban className="h-4 w-4" />
          </Button>
        </AdminConfirmDialog>
      )}

      {status === 'blocked' && (
        <AdminConfirmDialog
          title="Unblock User"
          description="Are you sure you want to unblock this user? They will regain access to the platform."
          actionLabel="Unblock User"
          actionVariant="default"
          onConfirm={handleUnblock}
        >
          <Button
            variant="outline"
            size="sm"
            disabled={isUnblocking}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
            title="Unblock"
          >
            <ShieldCheck className="h-4 w-4" />
          </Button>
        </AdminConfirmDialog>
      )}
    </div>
  );
}

// ─── skeleton rows ────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── role filter tabs (consistent with Refunds / Bookings / Payments) ─────────

const ROLE_TABS: { value: 'all' | AdminUserRole; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tutor', label: 'Tutors' },
  { value: 'student', label: 'Students' },
];

// ─── main page ────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | AdminUserRole>('all');
  const [page, setPage] = useState(1);

  // Backend supports `keyword` which searches both `email` and `fullName` (insensitive contains).
  const { data, isLoading, isError } = useAdminUsersQuery({
    keyword: searchQuery.trim() || undefined,
    role: selectedRole === 'all' ? undefined : selectedRole,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleRoleChange = (role: 'all' | AdminUserRole) => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <>
      <AdminPageHeader
        title="Users Management"
        description="Manage platform users, view details, and control account access."
      />

      <Card>
        {/* ── filter bar — same pattern as Refunds / Bookings / Payments ── */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          {/* search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="users-search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* role tabs */}
          <div className="flex gap-2 flex-wrap">
            {ROLE_TABS.map((tab) => (
              <Button
                key={tab.value}
                id={`users-filter-${tab.value}`}
                variant={selectedRole === tab.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRoleChange(tab.value)}
                className="capitalize"
              >
                {tab.label}
                {/* show total count only on the currently active tab since backend returns total for active query */}
                {selectedRole === tab.value && !isLoading && total > 0 && (
                  <span className="ml-1.5 text-xs opacity-75">({total})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* ── table ── */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonRows />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-destructive">
                    Failed to load users. Please try again.
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="max-w-xs">
                      <UserCell user={user} />
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {/* lastLoginAt is not provided by the list API — showing N/A */}
                      {formatLastLogin(user.lastLoginAt)}
                    </TableCell>
                    <TableCell>
                      <UserActionsCell userId={user.id} status={user.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── pagination ── */}
        {!isLoading && totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} &mdash; {total} total
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
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
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
