'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Award, Calendar, Mail } from 'lucide-react';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminTutorDetailQuery } from '@/features/admin-tutors';

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

  const {
    data: tutor,
    isLoading,
    isError,
  } = useAdminTutorDetailQuery(tutorProfileId);

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
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">
                Application Pending
              </h3>
              <p className="text-sm text-muted-foreground">
                This tutor is waiting for admin review. Approve/reject actions
                will be enabled after backend mutation endpoints are confirmed.
              </p>
            </Card>
          )}

          {tutor.profileStatus === 'approved' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">Account Active</h3>
              <p className="text-sm text-muted-foreground">
                This tutor is approved and visible on the platform.
              </p>
            </Card>
          )}

          {tutor.profileStatus === 'rejected' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">Application Rejected</h3>
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