'use client';

import { useTutorProfileQuery } from '@/features/tutor-profile/hooks/use-tutor-profile-query';
import { TutorProfileApprovalBanner } from '@/features/tutor-profile/components/tutor-profile-approval-banner';
import { TutorProfileSummaryCard } from '@/features/tutor-profile/components/tutor-profile-summary-card';
import { TutorProfileForm } from '@/features/tutor-profile/components/tutor-profile-form';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

export function TutorProfileSettings() {
  const { data: profile, isLoading, isError } = useTutorProfileQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-10 space-y-2">
        <h3 className="text-xl font-bold text-brand-dark">Unable to load profile</h3>
        <p className="text-sm text-muted-foreground font-medium">There was an error retrieving your tutor profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Tutor Profile Settings
        </h4>
        <p className="text-sm text-muted-foreground">
          Curate your professional presence and maintain your teaching credentials.
        </p>
      </div>

      <TutorProfileApprovalBanner
        status={profile.approvalStatus}
        reviewNote={profile.reviewNote}
      />

      <TutorProfileForm initialData={profile} />
    </div>
  );
}
