'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRowActions } from '@/components/admin/admin-row-actions';
import { AdminBulkActionBar } from '@/components/admin/admin-bulk-actions';
import { AdminPagination } from '@/components/admin/admin-pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockTutors } from '@/lib/admin/mock-data';

export default function TutorApprovalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filteredTutors = mockTutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tutor.approvalStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTutors.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedTutors = filteredTutors.slice(startIndex, startIndex + pageSize);

  const statusTabs = [
    { value: 'all', label: 'All', count: mockTutors.length },
    { value: 'pending', label: 'Pending', count: mockTutors.filter(t => t.approvalStatus === 'pending').length },
    { value: 'approved', label: 'Approved', count: mockTutors.filter(t => t.approvalStatus === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: mockTutors.filter(t => t.approvalStatus === 'rejected').length },
    { value: 'suspended', label: 'Suspended', count: mockTutors.filter(t => t.approvalStatus === 'suspended').length },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(paginatedTutors.map(t => t.id)));
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
        title="Tutor Approval" 
        description="Review and manage tutor applications."
        action={{
          label: 'Create Tutor',
          href: '/admin/tutors/create',
        }}
      />

      <Card>
        <AdminBulkActionBar 
          selectedCount={selected.size}
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
          <Tabs value={selectedStatus} onValueChange={(val) => {
            setSelectedStatus(val);
            setPage(1);
            setSelected(new Set());
          }} className="w-full">
            <div className="px-6">
              <TabsList className="gap-2">
                {statusTabs.map(tab => (
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
                    checked={selected.size > 0 && selected.size === paginatedTutors.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No tutors found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTutors.map(tutor => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(tutor.id)}
                        onCheckedChange={(checked) => handleSelectOne(tutor.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell className="text-sm">{tutor.email}</TableCell>
                    <TableCell className="text-sm">{tutor.subjects.slice(0, 2).join(', ')}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={tutor.approvalStatus} />
                    </TableCell>
                    <TableCell className="text-sm">{tutor.rating} ⭐</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tutor.submittedAt}</TableCell>
                    <TableCell>
                      <AdminRowActions
                        viewHref={`/admin/tutors/${tutor.id}`}
                        editHref={`/admin/tutors/${tutor.id}/edit`}
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
          total={filteredTutors.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </>
  );
}
