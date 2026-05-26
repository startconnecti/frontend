'use client';

import { useState } from 'react';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { Card } from '@/components/ui/card';
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
import { PAGINATION } from '@/constants/pagination';
import { 
  AdminTutorProfileChangeRequestStatus, 
  useAdminChangeRequestsQuery, 
  RequestStatusBadge 
} from '@/features/admin-tutor-profile-change-requests';

export default function TutorProfileChangeRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | AdminTutorProfileChangeRequestStatus
  >('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);

  const queryParams = {
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    page,
    limit: pageSize,
  };

  const { data, isLoading, isError } = useAdminChangeRequestsQuery(queryParams);

  const requests = data?.items ?? [];
  const total = data?.total ?? 0;

  const statusTabs = [
    { value: 'all' as const, label: 'All' },
    { value: 'pending' as const, label: 'Pending' },
    { value: 'approved' as const, label: 'Approved' },
    { value: 'rejected' as const, label: 'Rejected' },
    { value: 'cancelled' as const, label: 'Cancelled' },
  ];

  return (
    <>
      <AdminPageHeader
        title="Profile Change Requests"
        description="Review and manage tutor profile update requests."
      />

      <Card>
        <AdminBulkActions
          selectedCount={0}
          onClearSelection={() => {}}
        />

        <div className="border-b border-border">
          <Tabs
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value as 'all' | AdminTutorProfileChangeRequestStatus);
              setPage(1);
            }}
            className="w-full pt-4"
          >
            <div className="px-6">
              <TabsList className="gap-2">
                {statusTabs.map((tab) => (
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
                <TableHead>Tutor Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Loading change requests...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-destructive">
                    Failed to load change requests
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No change requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.requestId}>
                    <TableCell className="font-medium">{request.tutorName || 'Unknown Tutor'}</TableCell>

                    <TableCell>
                      <RequestStatusBadge status={request.status} />
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
                    </TableCell>

                    <TableCell>
                      <AdminRowActions
                        viewHref={ADMIN_ROUTES.TUTOR_PROFILE_CHANGE_REQUEST_DETAIL(request.requestId)}
                        showEdit={false}
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
          }}
        />
      </Card>
    </>
  );
}