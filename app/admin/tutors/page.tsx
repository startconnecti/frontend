'use client';

import { useState } from 'react';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
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
import { PAGINATION } from '@/constants/pagination';
import {
  AdminTutorProfileStatus,
  useAdminTutorsQuery,
} from '@/features/admin-tutors';

export default function TutorApprovalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | AdminTutorProfileStatus
  >('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const queryParams = {
    keyword: searchQuery.trim() || undefined,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    page,
    limit: pageSize,
  };

  const { data, isLoading, isError } = useAdminTutorsQuery(queryParams);

  const tutors = data?.items ?? [];
  const total = data?.total ?? 0;

  const statusTabs = [
    { value: 'all' as const, label: 'All' },
    { value: 'pending' as const, label: 'Pending' },
    { value: 'approved' as const, label: 'Approved' },
    { value: 'rejected' as const, label: 'Rejected' },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(tutors.map((tutor) => tutor.id)));
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
        title="Tutor Approval"
        description="Review and manage tutor applications."
      />

      <Card>
        <AdminBulkActions
          selectedCount={selected.size}
          onClearSelection={() => setSelected(new Set())}
        />

        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
              setSelected(new Set());
            }}
            className="max-w-sm"
          />
        </div>

        <div className="border-b border-border">
          <Tabs
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value as 'all' | AdminTutorProfileStatus);
              setPage(1);
              setSelected(new Set());
            }}
            className="w-full"
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={tutors.length > 0 && selected.size === tutors.length}
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  />
                </TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Loading tutors...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">
                    Failed to load tutors
                  </TableCell>
                </TableRow>
              ) : tutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No tutors found
                  </TableCell>
                </TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(tutor.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(tutor.id, Boolean(checked))
                        }
                      />
                    </TableCell>

                    <TableCell className="font-medium">{tutor.fullName}</TableCell>
                    <TableCell className="text-sm">{tutor.email}</TableCell>

                    <TableCell className="text-sm">
                      {tutor.subjects.length > 0
                        ? tutor.subjects.slice(0, 2).map((subject) => subject.name).join(', ')
                        : '-'}
                    </TableCell>

                    <TableCell>
                      <AdminStatusBadge status={tutor.profileStatus} />
                    </TableCell>

                    <TableCell className="text-sm">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(tutor.hourlyRate)}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(tutor.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <AdminRowActions
                        viewHref={ADMIN_ROUTES.TUTOR_DETAIL(tutor.id)}
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
            setSelected(new Set());
          }}
        />
      </Card>
    </>
  );
}
