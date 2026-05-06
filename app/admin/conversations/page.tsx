'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTableActions } from '@/components/admin/admin-table-actions';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { mockConversations } from '@/lib/admin/mock-data';

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredConversations = mockConversations.filter(conv =>
    conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <AdminPageHeader
        title="Manage Conversations"
        description="View and monitor user conversations for support and moderation."
      />

      <Card>
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by participant name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConversations.map(conv => (
              <TableRow key={conv.id}>
                <TableCell className="font-mono text-sm">{conv.id}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {conv.participants.map(p => p.name).join(', ')}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate text-sm text-muted-foreground">
                    {conv.lastMessage?.content || 'No messages'}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <span className={`capitalize px-2 py-1 rounded text-xs ${
                    conv.status === 'active' ? 'bg-green-100 text-green-700' : 
                    conv.status === 'archived' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {conv.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(conv.lastActivityAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <AdminTableActions
                    resourceId={conv.id}
                    basePath="/admin/conversations"
                    onDelete={setDeleteId}
                    hideEdit
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AdminConfirmDialog
        open={!!deleteId}
        title="Delete Conversation?"
        description="This action cannot be undone."
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
