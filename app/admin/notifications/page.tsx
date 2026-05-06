'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTableActions } from '@/components/admin/admin-table-actions';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { mockNotifications } from '@/lib/admin/mock-data';

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  const filteredNotifications = mockNotifications.filter(notif =>
    notif.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(filteredNotifications.map(n => n.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Manage Notifications"
        description="Create and manage system notifications."
        action={
          <Link href="/admin/notifications/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Notification
            </Button>
          </Link>
        }
      />

      <AdminBulkActions
        selectedCount={selectedRows.size}
        onClearSelection={() => setSelectedRows(new Set())}
        onBulkDelete={() => setBulkDeleteIds(Array.from(selectedRows))}
      />

      <Card>
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Recipient Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotifications.map(notif => (
              <TableRow key={notif.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(notif.id)}
                    onCheckedChange={() => handleSelectRow(notif.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">{notif.id}</TableCell>
                <TableCell className="font-medium">{notif.title}</TableCell>
                <TableCell className="text-sm">{notif.type}</TableCell>
                <TableCell className="text-sm capitalize">{notif.recipientRole}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded ${notif.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    {notif.read ? 'Read' : 'Unread'}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <AdminTableActions
                    resourceId={notif.id}
                    basePath="/admin/notifications"
                    onDelete={setDeleteId}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AdminConfirmDialog
        open={!!deleteId}
        title="Delete Notification?"
        description="This action cannot be undone."
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />

      <AdminConfirmDialog
        open={!!bulkDeleteIds}
        title="Delete Selected Notifications?"
        description={`This will delete ${bulkDeleteIds?.length || 0} notifications permanently.`}
        onConfirm={() => {
          setBulkDeleteIds(null);
          setSelectedRows(new Set());
        }}
        onCancel={() => setBulkDeleteIds(null)}
      />
    </>
  );
}
