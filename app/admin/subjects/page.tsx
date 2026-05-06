'use client';

import { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSubjects } from '@/lib/admin/mock-data';

export default function SubjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <AdminPageHeader
        title="Subjects Management"
        description="Manage available tutoring subjects and categories."
        action={{
          label: 'Create Subject',
          onClick: () => setShowCreateDialog(true),
        }}
      />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No subjects found
                  </TableCell>
                </TableRow>
              ) : (
                mockSubjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="font-mono text-sm">{subject.slug}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{subject.description || '-'}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={subject.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{subject.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AdminConfirmDialog
                          title="Delete Subject?"
                          description="This action cannot be undone. The subject will be permanently deleted."
                          actionLabel="Delete"
                          actionVariant="destructive"
                          onConfirm={() => console.log('Deleted')}
                        >
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AdminConfirmDialog>
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
