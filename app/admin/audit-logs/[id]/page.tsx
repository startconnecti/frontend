'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AuditLogDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/audit-logs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card className="p-12 text-center">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">Feature Coming Soon</p>
          <p className="text-muted-foreground">
            Audit log details are currently in development. Backend API integration will enable detailed audit trail viewing.
          </p>
        </div>
      </Card>
    </div>
  );
}
