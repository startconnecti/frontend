'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockPayouts, mockUsers } from '@/lib/admin/mock-data';

export default function PayoutDetailPage({ params }: { params: { id: string } }) {
  const payout = mockPayouts.find(p => p.id === params.id);
  const tutor = payout ? mockUsers.find(u => u.id === payout.tutorId) : null;
  const [status, setStatus] = useState(payout?.status);

  if (!payout || !tutor) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Payout not found</p>
      </div>
    );
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/payouts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payout {payout.id}</h1>
            <p className="text-sm text-muted-foreground">
              Requested on {new Date(payout.requestedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Link href={`/admin/payouts/${payout.id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Payout Summary */}
          <Card className="p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Payout Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Amount</span>
                <span className="font-semibold">${payout.grossAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Commission (20%)</span>
                  <span>-${payout.platformCommission.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Net Payout Amount</span>
                  <span className="text-lg font-bold text-primary">${payout.netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Tutor Information */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Tutor Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{tutor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-mono text-sm">{tutor.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span className="font-medium">${tutor.hourlyRate}/hr</span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{payout.paymentMethod}</span>
              </div>
              {payout.processedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processed At</span>
                  <span className="font-medium">{new Date(payout.processedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {payout.note && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Notes</h2>
              <p className="text-sm text-muted-foreground">{payout.note}</p>
            </Card>
          )}
        </div>

        {/* Right Column - Admin Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Status</h2>
            <div className="mb-4">
              <AdminStatusBadge status={status || payout.status} type="payout" />
            </div>
            <div className="space-y-2">
              {(['pending', 'processing', 'paid', 'failed'] as const).map(s => (
                <Button
                  key={s}
                  variant={status === s ? 'default' : 'outline'}
                  className="w-full text-sm"
                  onClick={() => handleStatusChange(s)}
                >
                  Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full text-sm">
                Resend Notification
              </Button>
              <Button variant="outline" className="w-full text-sm">
                View Related Payments
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
