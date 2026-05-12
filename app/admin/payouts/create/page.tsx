'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CreatePayoutPage() {
  return (
    <>
      <AdminPageHeader
        title="Create Payout"
        description="Create a new tutor payout record."
        backButton={
          <Link href="/admin/payouts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card className="p-12 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature Coming Soon</p>
          <p className="text-muted-foreground">
            Payout creation is currently in development. Backend API integration will enable manual payout record creation and management.
          </p>
        </div>
      </Card>
    </>
  );
}
