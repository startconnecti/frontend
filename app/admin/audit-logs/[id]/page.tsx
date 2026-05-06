'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockAuditLogs } from '@/lib/admin/mock-data';

export default function AuditLogDetailPage({ params }: { params: { id: string } }) {
  const log = mockAuditLogs.find(l => l.id === params.id);

  if (!log) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Audit log not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/audit-logs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Log {log.id}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {/* Actor Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Actor Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actor ID</span>
              <span className="font-mono text-sm">{log.actorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Actor Email</span>
              <span className="font-mono text-sm">{log.actorEmail}</span>
            </div>
          </div>
        </Card>

        {/* Action Details */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Action Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Action</span>
              <span className="font-medium capitalize">{log.action}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entity Type</span>
              <span className="font-medium">{log.entityType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entity ID</span>
              <span className="font-mono text-sm">{log.entityId}</span>
            </div>
          </div>
        </Card>

        {/* Network Information */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Network Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP Address</span>
              <span className="font-mono text-sm">{log.ipAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User Agent</span>
              <span className="text-xs text-muted-foreground truncate max-w-md">{log.userAgent}</span>
            </div>
          </div>
        </Card>

        {/* Changes */}
        {(log.beforeValue || log.afterValue) && (
          <div className="grid gap-6 md:grid-cols-2">
            {log.beforeValue && (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Before</h2>
                <pre className="overflow-auto text-xs bg-muted p-3 rounded">
                  {JSON.stringify(log.beforeValue, null, 2)}
                </pre>
              </Card>
            )}
            {log.afterValue && (
              <Card className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">After</h2>
                <pre className="overflow-auto text-xs bg-muted p-3 rounded">
                  {JSON.stringify(log.afterValue, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
