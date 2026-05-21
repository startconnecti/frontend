'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PAGINATION } from '@/constants/pagination';
import { useAdminSessionsQuery, useAdminCancelSessionMutation, useAdminForceCompleteSessionMutation } from '@/features/admin-sessions';

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

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);
  const [sessionToForceComplete, setSessionToForceComplete] = useState<string | null>(null);

  const cancelMutation = useAdminCancelSessionMutation();
  const forceCompleteMutation = useAdminForceCompleteSessionMutation();

  const { data: sessionsData, isLoading, isError } = useAdminSessionsQuery({
    keyword: searchQuery || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter as any,
    page,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  const filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const handleCancel = () => {
    if (sessionToCancel) {
      cancelMutation.mutate({ id: sessionToCancel, reason: 'Cancelled by Admin' }, {
        onSuccess: () => setSessionToCancel(null)
      });
    }
  };

  const handleForceComplete = () => {
    if (sessionToForceComplete) {
      forceCompleteMutation.mutate({ id: sessionToForceComplete, reason: 'Force completed by Admin' }, {
        onSuccess: () => setSessionToForceComplete(null)
      });
    }
  };

  const renderTableRows = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-10" /></TableCell>
        </TableRow>
      ));
    }

    if (isError || !sessionsData) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-destructive">
            Error loading sessions
          </TableCell>
        </TableRow>
      );
    }

    if (sessionsData.items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
            No sessions found
          </TableCell>
        </TableRow>
      );
    }

    return sessionsData.items.map(session => {
      const showCancel = !['cancelled', 'completed'].includes(session.status);
      const showForceComplete = session.status === 'scheduled' || session.status === 'ongoing';

      return (
        <TableRow key={session.id}>
          <TableCell className="font-mono text-sm">{session.id}</TableCell>
          <TableCell>{session.subjectName}</TableCell>
          <TableCell className="text-sm">{formatDate(session.startTime)}</TableCell>
          <TableCell>
            <AdminStatusBadge status={session.status} />
          </TableCell>
          <TableCell>
            {session.recordingUrl ? (
              <a href={session.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                View
              </a>
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            )}
          </TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/admin/sessions/${session.id}`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> View Details
                  </DropdownMenuItem>
                </Link>
                {showForceComplete && (
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setSessionToForceComplete(session.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Force Complete
                  </DropdownMenuItem>
                )}
                {showCancel && (
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive"
                    onClick={() => setSessionToCancel(session.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <AdminPageHeader title="Sessions Management" description="Monitor and manage all learning sessions." />

      <Card>
        {/* Filters */}
        <div className="border-b border-border px-6 py-4 space-y-4">
          <Input
            placeholder="Search session ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {filterTabs.map(tab => (
              <Button
                key={tab.value}
                variant={statusFilter === tab.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableRows()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && sessionsData && sessionsData.totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {sessionsData.page} of {sessionsData.totalPages}
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
                onClick={() => setPage(Math.min(sessionsData.totalPages, page + 1))}
                disabled={page === sessionsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={!!sessionToCancel} onOpenChange={(open) => !open && setSessionToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleCancel(); }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              Cancel Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!sessionToForceComplete} onOpenChange={(open) => !open && setSessionToForceComplete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Force Complete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to force complete this session? This is typically used if a session ended but didn't update automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleForceComplete(); }}
              className="bg-green-600 hover:bg-green-600/90"
              disabled={forceCompleteMutation.isPending}
            >
              Force Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
