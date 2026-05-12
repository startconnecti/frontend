'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Award, Calendar, Mail } from 'lucide-react';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useToast } from '@/hooks/use-toast';
import {
  useAdminTutorDetailQuery,
  useApproveTutorProfileMutation,
  useRejectTutorProfileMutation,
  useSuspendTutorProfileMutation,
  useUnsuspendTutorProfileMutation,
} from '@/features/admin-tutors';

function TutorDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="p-6">
          <Skeleton className="mb-3 h-8 w-56" />
          <Skeleton className="mb-2 h-4 w-72" />
          <Skeleton className="h-4 w-44" />
        </Card>

        <Card className="p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </Card>

        <Card className="p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
}

export default function TutorDetailPage() {
  const params = useParams();
  const tutorProfileId = params.id as string;
  const { toast } = useToast();

  const [approvalNote, setApprovalNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [unsuspendNote, setUnsuspendNote] = useState('');

  const {
    data: tutor,
    isLoading,
    isError,
  } = useAdminTutorDetailQuery(tutorProfileId);

  const approveMutation = useApproveTutorProfileMutation(tutorProfileId);
  const rejectMutation = useRejectTutorProfileMutation(tutorProfileId);
  const suspendMutation = useSuspendTutorProfileMutation(tutorProfileId);
  const unsuspendMutation = useUnsuspendTutorProfileMutation(tutorProfileId);

  const isMutating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    suspendMutation.isPending ||
    unsuspendMutation.isPending;

  useEffect(() => {
    if (approveMutation.isSuccess) {
      toast({
        title: 'Success',
        description: 'Tutor profile approved successfully.',
      });
    }
  }, [approveMutation.isSuccess, toast]);

  useEffect(() => {
    if (approveMutation.isError) {
      toast({
        title: 'Error',
        description: 'Failed to approve tutor profile.',
        variant: 'destructive',
      });
    }
  }, [approveMutation.isError, toast]);

  useEffect(() => {
    if (rejectMutation.isSuccess) {
      toast({
        title: 'Success',
        description: 'Tutor profile rejected successfully.',
      });
    }
  }, [rejectMutation.isSuccess, toast]);

  useEffect(() => {
    if (rejectMutation.isError) {
      toast({
        title: 'Error',
        description: 'Failed to reject tutor profile.',
        variant: 'destructive',
      });
    }
  }, [rejectMutation.isError, toast]);

  useEffect(() => {
    if (suspendMutation.isSuccess) {
      toast({
        title: 'Success',
        description: 'Tutor profile suspended successfully.',
      });
    }
  }, [suspendMutation.isSuccess, toast]);

  useEffect(() => {
    if (suspendMutation.isError) {
      toast({
        title: 'Error',
        description: 'Failed to suspend tutor profile.',
        variant: 'destructive',
      });
    }
  }, [suspendMutation.isError, toast]);

  useEffect(() => {
    if (unsuspendMutation.isSuccess) {
      toast({
        title: 'Success',
        description: 'Tutor profile unsuspended successfully.',
      });
    }
  }, [unsuspendMutation.isSuccess, toast]);

  useEffect(() => {
    if (unsuspendMutation.isError) {
      toast({
        title: 'Error',
        description: 'Failed to unsuspend tutor profile.',
        variant: 'destructive',
      });
    }
  }, [unsuspendMutation.isError, toast]);

  const handleApprove = () => {
    approveMutation.mutate(
      { note: approvalNote.trim() || undefined },
      {
        onSuccess: () => {
          setApprovalNote('');
        },
      }
    );
  };

  const handleReject = () => {
    const reason = rejectReason.trim();

    if (!reason) {
      toast({
        title: 'Validation Error',
        description: 'Rejection reason is required.',
        variant: 'destructive',
      });
      return;
    }

    rejectMutation.mutate(
      { reason },
      {
        onSuccess: () => {
          setRejectReason('');
        },
      }
    );
  };

  const handleSuspend = () => {
    const reason = suspendReason.trim();

    if (!reason) {
      toast({
        title: 'Validation Error',
        description: 'Suspension reason is required.',
        variant: 'destructive',
      });
      return;
    }

    suspendMutation.mutate(
      { reason },
      {
        onSuccess: () => {
          setSuspendReason('');
        },
      }
    );
  };

  const handleUnsuspend = () => {
    unsuspendMutation.mutate(
      { note: unsuspendNote.trim() || undefined },
      {
        onSuccess: () => {
          setUnsuspendNote('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href={ADMIN_ROUTES.TUTORS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Tutor Details</h1>
        </div>

        <TutorDetailSkeleton />
      </>
    );
  }

  if (isError || !tutor) {
    return <AdminRecordNotFound backHref={ADMIN_ROUTES.TUTORS} />;
  }

  const createdAt = new Date(tutor.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedAt = tutor.updatedAt
    ? new Date(tutor.updatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null;

  const hourlyRate = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(tutor.hourlyRate);

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ADMIN_ROUTES.TUTORS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Tutor Details</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {tutor.fullName || 'Unknown Tutor'}
                </h2>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tutor.email}</span>
                  </div>
                </div>
              </div>

              <AdminStatusBadge status={tutor.profileStatus} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Bio</h3>
            <p className="text-sm leading-relaxed text-foreground">
              {tutor.bio || 'No bio provided.'}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Experience</h3>
            <p className="text-sm leading-relaxed text-foreground">
              {tutor.experienceText || 'No experience details provided.'}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Expertise</h3>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Subjects
                </p>

                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.length > 0 ? (
                    tutor.subjects.map((subject) => (
                      <Badge key={subject.id} variant="secondary">
                        {subject.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No subjects</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-lg font-bold text-foreground">{hourlyRate}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Certificates</h3>

            {tutor.certifications.length > 0 ? (
              <div className="space-y-3">
                {tutor.certifications.map((certification, index) => (
                  <div
                    key={certification.id ?? `${certification.name}-${index}`}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {certification.name || 'Untitled certificate'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {certification.issuer || 'Unknown issuer'}
                      </p>
                      {certification.uploadedAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Uploaded:{' '}
                          {new Date(certification.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No certificates uploaded.
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {tutor.profileStatus === 'pending' && (
            <>
              <Card className="p-6">
                <h3 className="mb-4 font-bold text-foreground">
                  Approve Application
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Approving this profile makes the tutor available on the platform.
                </p>

                <Textarea
                  placeholder="Optional approval note..."
                  value={approvalNote}
                  onChange={(event) => setApprovalNote(event.target.value)}
                  rows={3}
                  disabled={isMutating}
                />

                <div className="mt-4">
                  <AdminConfirmDialog
                    title="Approve Tutor?"
                    description="This tutor will become visible and eligible to receive bookings."
                    actionLabel={approveMutation.isPending ? 'Approving...' : 'Approve'}
                    triggerLabel={approveMutation.isPending ? 'Approving...' : 'Approve Tutor'}
                    triggerVariant="default"
                    triggerDisabled={approveMutation.isPending}
                    onConfirm={handleApprove}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-bold text-foreground">
                  Reject Application
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Provide a clear reason so the tutor can understand what to fix.
                </p>

                <Textarea
                  placeholder="Required rejection reason..."
                  value={rejectReason}
                  onChange={(event) => setRejectReason(event.target.value)}
                  rows={4}
                  disabled={isMutating}
                />

                <div className="mt-4">
                  <AdminConfirmDialog
                    title="Reject Tutor?"
                    description="This tutor profile will be rejected. The tutor may need to update and resubmit their profile."
                    actionLabel={rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                    actionVariant="destructive"
                    triggerLabel={rejectMutation.isPending ? 'Rejecting...' : 'Reject Tutor'}
                    triggerVariant="destructive"
                    triggerDisabled={!rejectReason.trim() || rejectMutation.isPending}
                    onConfirm={handleReject}
                  />
                </div>

                {!rejectReason.trim() && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Rejection reason is required.
                  </p>
                )}
              </Card>
            </>
          )}

          {tutor.profileStatus === 'approved' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">Suspend Tutor</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Suspending this tutor prevents them from receiving new bookings.
              </p>

              <Textarea
                placeholder="Required suspension reason..."
                value={suspendReason}
                onChange={(event) => setSuspendReason(event.target.value)}
                rows={4}
                disabled={isMutating}
              />

              <div className="mt-4">
                <AdminConfirmDialog
                  title="Suspend Tutor?"
                  description="This tutor will be suspended and hidden from normal marketplace activity."
                  actionLabel={suspendMutation.isPending ? 'Suspending...' : 'Suspend'}
                  actionVariant="destructive"
                  triggerLabel={suspendMutation.isPending ? 'Suspending...' : 'Suspend Tutor'}
                  triggerVariant="destructive"
                  triggerDisabled={!suspendReason.trim() || suspendMutation.isPending}
                  onConfirm={handleSuspend}
                />
              </div>

              {!suspendReason.trim() && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Suspension reason is required.
                </p>
              )}
            </Card>
          )}

          {tutor.profileStatus === 'suspended' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">Unsuspend Tutor</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Unsuspending this tutor allows them to operate again.
              </p>

              <Textarea
                placeholder="Optional unsuspension note..."
                value={unsuspendNote}
                onChange={(event) => setUnsuspendNote(event.target.value)}
                rows={3}
                disabled={isMutating}
              />

              <div className="mt-4">
                <AdminConfirmDialog
                  title="Unsuspend Tutor?"
                  description="This tutor will regain normal platform access."
                  actionLabel={unsuspendMutation.isPending ? 'Unsuspending...' : 'Unsuspend'}
                  triggerLabel={unsuspendMutation.isPending ? 'Unsuspending...' : 'Unsuspend Tutor'}
                  triggerVariant="outline"
                  triggerDisabled={unsuspendMutation.isPending}
                  onConfirm={handleUnsuspend}
                />
              </div>
            </Card>
          )}

          {tutor.profileStatus === 'rejected' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">
                Application Rejected
              </h3>
              <p className="text-sm text-muted-foreground">
                {tutor.approvalNote || 'No rejection note provided.'}
              </p>
            </Card>
          )}

          <Card className="bg-muted/50 p-6">
            <h4 className="mb-2 text-sm font-bold text-foreground">
              Submission Info
            </h4>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {createdAt}</span>
              </div>

              {updatedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Updated: {updatedAt}</span>
                </div>
              )}

              <p className="break-all font-mono">Profile ID: {tutor.id}</p>
              <p className="break-all font-mono">User ID: {tutor.userId}</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
