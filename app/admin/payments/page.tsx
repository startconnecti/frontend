'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPayments } from '@/lib/admin/mock-data';

export default function PaymentsPage() {
  return (
    <>
      <AdminPageHeader title="Payments Management" description="Track and manage all payment transactions." />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Paid At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                mockPayments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell className="font-medium">${payment.amount} {payment.currency}</TableCell>
                    <TableCell className="capitalize text-sm">{payment.method}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.createdAt}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.paidAt || '-'}</TableCell>
                    <TableCell>
                      <Link href={`/admin/payments/${payment.id}`}>
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
