'use client';

import { PageContainer, SectionHeader } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';
import { useTutorProfileQuery } from '../hooks/use-tutor-profile-query';
import { useTutorProfileChangeRequestsQuery } from '../hooks/use-tutor-profile-change-requests';
import { TutorProfileApprovalBanner } from './tutor-profile-approval-banner';
import { TutorProfileForm } from './tutor-profile-form';
import { TutorProfileEmptyState } from './tutor-profile-empty-state';
import { Button } from '@/components/ui/button';
import { History, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function TutorProfileManagementPage() {
  const { data: profile, isLoading, isError, error } = useTutorProfileQuery();
  const { data: changeRequestsData, isLoading: isLoadingRequests } = useTutorProfileChangeRequestsQuery({ status: 'pending', limit: 1 });
  
  const hasPendingRequest = changeRequestsData?.items && changeRequestsData.items.length > 0;

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-10">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </PageContainer>
    );
  }

  const isNotFound = isError && (error as any)?.response?.status === 404;

  if (isNotFound || (!isLoading && !profile)) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-5xl">
        <TutorProfileEmptyState />
      </PageContainer>
    );
  }

  if (isError && !isNotFound) {
    return (
      <PageContainer className="py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h3 className="text-2xl font-black text-brand-dark">Unable to load profile</h3>
          <p className="text-muted-foreground font-medium">There was an error retrieving your tutor profile information. Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-10 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeader 
          title="Tutor Profile Management"
          description="Curate your professional presence and maintain your teaching credentials."
        />
        <Button variant="outline" className="gap-2 font-bold whitespace-nowrap shrink-0 relative" asChild>
          <Link href="/tutor/settings/tutor-profile/change-requests">
            <History className="h-4 w-4" />
            View Change Requests
            {hasPendingRequest && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white font-black shadow-sm">
                {changeRequestsData.items.length}
              </span>
            )}
          </Link>
        </Button>
      </div>

      {profile && (
        <>
          <TutorProfileApprovalBanner 
            status={profile.approvalStatus} 
            reviewNote={profile.reviewNote} 
          />

          <TutorProfileForm 
            initialData={profile} 
            hasPendingRequest={hasPendingRequest}
            isCreating={false}
          />
        </>
      )}
    </PageContainer>
  );
}
