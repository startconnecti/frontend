'use client';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useTutorProfileQuery } from '../hooks/use-tutor-profile-query';
import { TutorProfileApprovalBanner } from './tutor-profile-approval-banner';
import { TutorProfileSummaryCard } from './tutor-profile-summary-card';
import { TutorProfileForm } from './tutor-profile-form';

export function TutorProfileManagementPage() {
  const { data: profile, isLoading, isError } = useTutorProfileQuery();

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-10">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </PageContainer>
    );
  }

  if (isError || !profile) {
    return (
      <PageContainer className="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h3 className="text-2xl font-black text-brand-dark">Unable to load profile</h3>
          <p className="text-muted-foreground font-medium">There was an error retrieving your tutor profile information. Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-10 max-w-5xl">
      <SectionHeader 
        title="Tutor Profile Management"
        description="Curate your professional presence and maintain your teaching credentials."
      />

      <TutorProfileApprovalBanner 
        status={profile.approvalStatus} 
        reviewNote={profile.reviewNote} 
      />

      <TutorProfileSummaryCard profile={profile} />

      <TutorProfileForm initialData={profile} />
    </PageContainer>
  );
}
