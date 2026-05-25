'use client';

import { useTutorProfileQuery } from '@/features/tutor-profile/hooks/use-tutor-profile-query';
import { useTutorProfileChangeRequestsQuery } from '@/features/tutor-profile/hooks/use-tutor-profile-change-requests';
import { TutorProfileApprovalBanner } from '@/features/tutor-profile/components/tutor-profile-approval-banner';
import { TutorProfileForm } from '@/features/tutor-profile/components/tutor-profile-form';
import { TutorProfileEmptyState } from '@/features/tutor-profile/components/tutor-profile-empty-state';
import { TutorProfileDisplay } from '@/features/tutor-profile/components/tutor-profile-display';
import { TutorProfileDraftForm } from '@/features/tutor-profile/components/tutor-profile-draft-form';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, History, Lock, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export function TutorProfileSettings() {
  const { data: profile, isLoading, isError, error } = useTutorProfileQuery();
  const isNotFound = isError && (error as any)?.response?.status === 404;
  const isNoProfile = isNotFound || (!isLoading && !profile);
  const isApprovedLike = profile?.approvalStatus === 'approved' || profile?.approvalStatus === 'suspended';
  const canCreateDraft = isApprovedLike;

  const { data: changeRequestsData } = useTutorProfileChangeRequestsQuery(
    { status: 'pending', limit: 1 },
    { enabled: !!profile && canCreateDraft }
  );
  const [isDraftMode, setIsDraftMode] = useState(false);

  const hasPendingRequest = changeRequestsData?.items && changeRequestsData.items.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  if (isNoProfile) {
    return <TutorProfileEmptyState />;
  }

  if (isError && !isNotFound) {
    return (
      <div className="text-center py-10 space-y-2">
        <h3 className="text-xl font-bold text-brand-dark">Unable to load profile</h3>
        <p className="text-sm text-muted-foreground font-medium">There was an error retrieving your tutor profile information.</p>
      </div>
    );
  }

  if (!profile) return null; // Satisfy TS

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-bold text-brand-dark flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Tutor Profile Settings
          </h4>
          <p className="text-sm text-muted-foreground">
            Curate your professional presence and maintain your teaching credentials.
          </p>
        </div>
        <Button variant="outline" className="gap-2 font-bold whitespace-nowrap shrink-0 relative" asChild>
          <Link href="/settings/tutor-profile/change-requests">
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

      <TutorProfileApprovalBanner
        status={profile.approvalStatus}
        reviewNote={profile.reviewNote}
      />

      {canCreateDraft ? (
        isDraftMode ? (
          <TutorProfileDraftForm 
            initialData={profile} 
            onCancel={() => setIsDraftMode(false)} 
          />
        ) : (
          <div className="space-y-6">
            {hasPendingRequest ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3">
                <Lock className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Pending Request Active</h4>
                  <p className="text-sm">You already have a pending change request awaiting admin review. You cannot create a new request until it is resolved.</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button size="lg" className="font-black gap-2 rounded-2xl" onClick={() => setIsDraftMode(true)}>
                  <Edit3 className="h-5 w-5" />
                  Create Change Request
                </Button>
              </div>
            )}
            <TutorProfileDisplay profile={profile} />
          </div>
        )
      ) : (
        <TutorProfileForm initialData={profile} />
      )}
    </div>
  );
}
