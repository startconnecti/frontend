'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Award, Calendar, Mail, FileText, Image as ImageIcon } from 'lucide-react';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useToast } from '@/hooks/use-toast';
import {
  useAdminTutorDetailQuery,
  useApproveTutorProfileMutation,
  useRejectTutorProfileMutation,
  useSuspendTutorProfileMutation,
  useUnsuspendTutorProfileMutation,
} from '@/features/admin-tutors';
import { getMediaUrl } from '@/lib/media';

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

  const [reviewDecision, setReviewDecision] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [previewCert, setPreviewCert] = useState<any>(null);
  
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

  const handleReviewSubmit = () => {
    const comment = reviewComment.trim();

    if (reviewDecision === 'approve') {
      approveMutation.mutate(
        { note: comment || undefined },
        {
          onSuccess: () => {
            setReviewComment('');
          },
        }
      );
    } else {
      if (!comment || comment.length < 10) {
        toast({
          title: 'Validation Error',
          description: 'Rejection reason must be at least 10 characters.',
          variant: 'destructive',
        });
        return;
      }

      rejectMutation.mutate(
        { reason: comment },
        {
          onSuccess: () => {
            setReviewComment('');
          },
        }
      );
    }
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
                  {(tutor.subjects || []).length > 0 ? (
                    (tutor.subjects || []).map((subject) => (
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

            {(tutor.certifications || []).length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {(tutor.certifications || []).map((cert, index) => (
                  <div
                    key={cert.id ?? `${cert.certificateName}-${index}`}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="flex items-start gap-3">
                      {cert.fileUrl && cert.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <div 
                          className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted cursor-pointer shrink-0" 
                          onClick={() => setPreviewCert(cert)}
                        >
                          <img src={getMediaUrl(cert.fileUrl)} alt="Certificate thumbnail" className="h-full w-full object-cover" />
                        </div>
                      ) : cert.fileUrl ? (
                        <div 
                          className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted cursor-pointer hover:bg-muted/80 shrink-0" 
                          onClick={() => setPreviewCert(cert)}
                        >
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <Award className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
                      )}
                      
                      <div className="flex-1">
                        <p className="font-bold text-foreground">
                          {cert.certificateName || 'Untitled certificate'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Issuer: {cert.issuingOrganization || 'Unknown'}
                        </p>
                        {cert.issueDate && (
                          <p className="text-sm text-muted-foreground">
                            Issued At: {cert.issueDate}
                          </p>
                        )}
                        {cert.status && (
                          <div className="mt-1">
                            <AdminStatusBadge status={cert.status as any} />
                          </div>
                        )}
                      </div>
                    </div>

                    {cert.fileUrl && (
                      <div className="mt-2 flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPreviewCert(cert)}
                        >
                          Preview
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          asChild
                        >
                          <a href={getMediaUrl(cert.fileUrl)} target="_blank" rel="noreferrer">
                            Open Full Size
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No certificates uploaded
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          {tutor.profileStatus === 'pending' && (
            <>
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">
                Review Tutor Profile
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Decide whether to approve or reject this tutor application.
              </p>

              <div className="space-y-6">
                <RadioGroup
                  value={reviewDecision}
                  onValueChange={(val: 'approve' | 'reject') => setReviewDecision(val)}
                  className="flex gap-6"
                  disabled={isMutating}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approve" id="approve" />
                    <Label htmlFor="approve" className="cursor-pointer font-medium">Approve</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reject" id="reject" />
                    <Label htmlFor="reject" className="cursor-pointer font-medium">Reject</Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label>
                    Comment {reviewDecision === 'reject' && <span className="text-destructive">*</span>}
                  </Label>
                  <Textarea
                    placeholder={reviewDecision === 'approve' ? "Optional approval note..." : "Required rejection reason (min 10 chars)..."}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    disabled={isMutating}
                    className={reviewDecision === 'reject' && reviewComment.trim().length > 0 && reviewComment.trim().length < 10 ? 'border-destructive' : ''}
                  />
                  {reviewDecision === 'reject' && reviewComment.trim().length > 0 && reviewComment.trim().length < 10 && (
                    <p className="text-xs text-destructive font-medium">Comment must be at least 10 characters.</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant={reviewDecision === 'approve' ? 'default' : 'destructive'}
                  disabled={
                    isMutating ||
                    (reviewDecision === 'reject' && reviewComment.trim().length < 10)
                  }
                  onClick={handleReviewSubmit}
                >
                  {isMutating ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
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
      <Dialog open={!!previewCert} onOpenChange={(open) => !open && setPreviewCert(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewCert?.certificateName || 'Certificate Preview'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-4 bg-muted/20 min-h-[50vh] rounded-md">
            {previewCert?.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
              <img src={getMediaUrl(previewCert.fileUrl)} alt="Certificate" className="max-h-[70vh] object-contain rounded-md" />
            ) : previewCert?.fileUrl?.match(/\.pdf$/i) ? (
              <iframe src={getMediaUrl(previewCert.fileUrl)} className="w-full h-[70vh] rounded-md border-0" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p>Preview not available for this file type.</p>
                <Button asChild>
                  <a href={getMediaUrl(previewCert?.fileUrl)} target="_blank" rel="noreferrer">Open File</a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
