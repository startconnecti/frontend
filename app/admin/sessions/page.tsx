'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSessions } from '@/lib/admin/mock-data';

export default function SessionsPage() {
  return (
    <>
      <AdminPageHeader title="Sessions Management" description="Monitor and manage all learning sessions." />

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                mockSessions.map(session => (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-sm">{session.id}</TableCell>
                    <TableCell>{session.subject}</TableCell>
                    <TableCell className="text-sm">{new Date(session.startTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <AdminStatusBadge status={session.status} />
                    </TableCell>
                    <TableCell>
                      {session.recordingUrl ? (
                        <a href={session.recordingUrl} className="text-primary hover:underline text-sm">
                          View
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/sessions/${session.id}`}>
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
