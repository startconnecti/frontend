'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { mockTutors } from '@/lib/admin/mock-data';

export default function TutorApprovalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');

  const filteredTutors = mockTutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tutor.approvalStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusTabs = [
    { value: 'all', label: 'All', count: mockTutors.length },
    { value: 'pending', label: 'Pending', count: mockTutors.filter(t => t.approvalStatus === 'pending').length },
    { value: 'approved', label: 'Approved', count: mockTutors.filter(t => t.approvalStatus === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: mockTutors.filter(t => t.approvalStatus === 'rejected').length },
    { value: 'suspended', label: 'Suspended', count: mockTutors.filter(t => t.approvalStatus === 'suspended').length },
  ];

  return (
    <>
      <AdminPageHeader title="Tutor Approval" description="Review and manage tutor applications." />

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
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
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
              {filteredTutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No tutors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTutors.map(tutor => (
                  <TableRow key={tutor.id}>
                    <TableCell className="font-medium">{tutor.name}</TableCell>
                    <TableCell className="text-sm">{tutor.email}</TableCell>
                    <TableCell className="text-sm">{tutor.subjects.slice(0, 2).join(', ')}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={tutor.approvalStatus} />
                    </TableCell>
                    <TableCell className="text-sm">{tutor.rating} ⭐</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tutor.submittedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/tutors/${tutor.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {tutor.approvalStatus === 'pending' && (
                          <>
                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
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
