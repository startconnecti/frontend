'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { AdminPageHeader } from '@/components/admin/admin-page-header';

import {
  useAdminChangeRequestDetailQuery,
  RequestStatusBadge,
  SnapshotRenderer,
  ApprovalDialog,
  RejectionDialog
} from '@/features/admin-tutor-profile-change-requests';

export default function AdminChangeRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;
  const router = useRouter();

  const { data: detail, isLoading, isError } = useAdminChangeRequestDetailQuery(requestId);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-muted-foreground animate-pulse">Loading change request details...</div>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="p-8 flex flex-col justify-center items-center h-64 gap-4">
        <div className="text-destructive font-medium">Failed to load change request details.</div>
        <Button variant="outline" onClick={() => router.push(ADMIN_ROUTES.TUTOR_PROFILE_CHANGE_REQUESTS)}>
          Return to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href={ADMIN_ROUTES.TUTOR_PROFILE_CHANGE_REQUESTS}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <AdminPageHeader
          title="Change Request Details"
          description={`Reviewing proposed profile changes for ${detail.tutor.fullName || 'Unknown Tutor'}`}
        />
        <div className="ml-auto">
          <RequestStatusBadge status={detail.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tutor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{detail.tutor.fullName || 'Unnamed'}</p>
                  <p className="text-xs text-muted-foreground">{detail.tutor.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <Link href={ADMIN_ROUTES.TUTOR_DETAIL(detail.tutorProfileId)}>
                  <Button variant="link" className="px-0 h-auto">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Submitted At</p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {new Date(detail.createdAt).toLocaleString()}
                </div>
              </div>
              
              {detail.requestNote && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tutor Note</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-md italic">"{detail.requestNote}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {detail.status !== 'pending' && detail.status !== 'cancelled' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Reviewed By</p>
                  <p className="text-sm font-medium">{detail.reviewedByAdmin?.fullName || 'Unknown Admin'}</p>
                </div>
                
                {detail.reviewedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reviewed At</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(detail.reviewedAt).toLocaleString()}
                    </div>
                  </div>
                )}
                
                {detail.reviewNote && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Admin Review Note</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-md italic">"{detail.reviewNote}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {detail.status === 'pending' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Approve or reject this change request</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ApprovalDialog 
                  requestId={detail.id}
                  trigger={
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve Changes
                    </Button>
                  }
                />
                
                <RejectionDialog 
                  requestId={detail.id}
                  trigger={
                    <Button variant="destructive" className="w-full gap-2">
                      <XCircle className="h-4 w-4" />
                      Reject Changes
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Snapshot Viewer */}
        <div className="lg:col-span-2">
          <SnapshotRenderer payload={detail.changePayload} />
        </div>
      </div>
    </div>
  );
}