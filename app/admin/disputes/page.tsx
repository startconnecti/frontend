'use client';

import Link from 'next/link';
import { Eye, AlertCircle } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDisputes } from '@/lib/admin/mock-data';

export default function DisputesPage() {
  const openCount = mockDisputes.filter(d => d.status === 'open').length;

  return (
    <>
      <AdminPageHeader title="Disputes Management" description={`Manage disputes and resolutions. ${openCount} open dispute${openCount !== 1 ? 's' : ''}.`} />

      {openCount > 0 && (
        <Card className="mb-6 border-l-4 border-l-destructive bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground">Action Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You have {openCount} open dispute{openCount !== 1 ? 's' : ''} awaiting resolution.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispute ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDisputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No disputes found
                  </TableCell>
                </TableRow>
              ) : (
                mockDisputes.map(dispute => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{dispute.subject}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={dispute.status} />
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={dispute.priority} customLabel={dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{dispute.createdAt}</TableCell>
                    <TableCell>
                      <Link href={`/admin/disputes/${dispute.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
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
