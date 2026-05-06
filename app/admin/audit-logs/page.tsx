'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { mockAuditLogs } from '@/lib/admin/mock-data';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockAuditLogs.filter(log =>
    log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminPageHeader
        title="Audit Logs"
        description="Immutable audit trail of all admin and system actions."
      />

      <Card>
        <div className="border-b border-border px-6 py-4">
          <Input
            placeholder="Search by actor email or entity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.id}</TableCell>
                <TableCell className="text-sm">{log.actorEmail}</TableCell>
                <TableCell>
                  <span className="text-sm capitalize px-2 py-1 rounded bg-muted">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{log.entityType}</TableCell>
                <TableCell className="font-mono text-xs">{log.entityId}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/audit-logs/${log.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
