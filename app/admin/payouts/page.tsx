'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminTableActions } from '@/components/admin/admin-table-actions';
import { AdminBulkActions } from '@/components/admin/admin-bulk-actions';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { mockPayouts, mockUsers } from '@/lib/admin/mock-data';

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  const filteredPayouts = mockPayouts.filter(payout => {
    const tutor = mockUsers.find(u => u.id === payout.tutorId);
    return tutor?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      setSelectedRows(new Set(filteredPayouts.map(p => p.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Manage Payouts"
        description="View and manage tutor payouts."
        action={
          <Link href="/admin/payouts/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Payout
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
        {/* Search Bar */}
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by tutor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === filteredPayouts.length && filteredPayouts.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Payout ID</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayouts.map(payout => {
              const tutor = mockUsers.find(u => u.id === payout.tutorId);
              return (
                <TableRow key={payout.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(payout.id)}
                      onCheckedChange={() => handleSelectRow(payout.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                  <TableCell>{tutor?.name}</TableCell>
                  <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={payout.status} type="payout" />
                  </TableCell>
                  <TableCell>{payout.paymentMethod}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(payout.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AdminTableActions
                      resourceId={payout.id}
                      basePath="/admin/payouts"
                      onDelete={setDeleteId}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <AdminConfirmDialog
        open={!!deleteId}
        title="Delete Payout?"
        description="This action cannot be undone."
        onConfirm={() => {
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      <AdminConfirmDialog
        open={!!bulkDeleteIds}
        title="Delete Selected Payouts?"
        description={`This will delete ${bulkDeleteIds?.length || 0} payouts permanently.`}
        onConfirm={() => {
          setBulkDeleteIds(null);
          setSelectedRows(new Set());
        }}
        onCancel={() => setBulkDeleteIds(null)}
      />
    </>
  );
}
