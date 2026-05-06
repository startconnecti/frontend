'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockRefunds } from '@/lib/admin/mock-data';

export default function RefundsPage() {
  return (
    <>
      <AdminPageHeader title="Refunds Management" description="Review and process refund requests." />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund ID</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRefunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No refunds found
                  </TableCell>
                </TableRow>
              ) : (
                mockRefunds.map(refund => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                    <TableCell className="font-mono text-sm">{refund.paymentId}</TableCell>
                    <TableCell className="font-medium">${refund.amount}</TableCell>
                    <TableCell className="text-sm capitalize">{refund.reason.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={refund.status} customLabel={refund.status.charAt(0).toUpperCase() + refund.status.slice(1)} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{refund.requestedAt}</TableCell>
                    <TableCell>
                      <Link href={`/admin/refunds/${refund.id}`}>
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
