'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { 
  PageContainer, 
  ListState, 
  SectionHeader 
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useTutorDetailQuery } from '../hooks/use-tutor-detail-query';
import { useTutorFeedbacksQuery } from '@/features/feedbacks/hooks/use-tutor-feedbacks-query';
import { TutorProfileHeader } from './tutor-profile-header';
import { TutorProfileAbout } from './tutor-profile-about';
import { TutorProfileCertificates } from './tutor-profile-certificates';
import { TutorProfileAvailability } from './tutor-profile-availability';
import { TutorProfileReviews } from './tutor-profile-reviews';
import { TutorBookingSummaryCard } from './tutor-booking-summary-card';

interface TutorProfilePageProps {
  id: string;
}

export function TutorProfilePage({ id }: TutorProfilePageProps) {
  const reviewLimit = 4;
  const [reviewOffset, setReviewOffset] = useState(0);
  const { data: tutor, isLoading, error } = useTutorDetailQuery(id, true);
  const { data: feedbacksData } = useTutorFeedbacksQuery(tutor?.id, reviewLimit, reviewOffset);
  const feedbacks = (feedbacksData?.items ?? tutor?.feedbacks ?? []).map((feedback: any) => ({
    id: feedback.id,
    studentName: feedback.studentName || 'Student',
    rating: Number(feedback.rating) || 0,
    comment: feedback.comment || '',
    date: feedback.createdAt || feedback.date || '',
  }));
  const feedbackTotal = feedbacksData?.total;

  return (
    <PageContainer className="py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-8 -ml-4 gap-2 text-muted-foreground" asChild>
        <Link href={ROUTES.DISCOVER}>
          <ArrowLeft className="h-4 w-4" />
          Back to Tutors
        </Link>
      </Button>

      <ListState 
        isLoading={isLoading} 
        error={error as Error} 
        isEmpty={!tutor}
        emptyTitle="Tutor not found"
        emptyDescription="The tutor you are looking for doesn't exist or isn't available at the moment."
      >
        {tutor && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <TutorProfileHeader 
                name={tutor.fullName}
                avatarUrl={tutor.avatarUrl}
                subjects={tutor.subjects}
                rating={tutor.averageRating}
                reviewCount={tutor.totalReviews ?? 0}
                hourlyRate={tutor.hourlyRate}
                experience={tutor.yearsOfExperience}
                bio={tutor.bio}
                isFavorite={tutor.isFavorite}
              />

              <TutorProfileAbout bio={tutor.bio} experienceText={tutor.experienceText} />

              <TutorProfileCertificates certificates={tutor.certifications ?? tutor.certificates} />

              <TutorProfileAvailability slots={tutor.weeklyAvailability ?? tutor.availabilitySlots} />

              <TutorProfileReviews 
                feedbacks={feedbacks} 
                averageRating={tutor.averageRating} 
                limit={feedbacksData?.limit ?? reviewLimit}
                offset={feedbacksData?.offset ?? reviewOffset}
                total={feedbackTotal}
                onPrevious={() => setReviewOffset((offset) => Math.max(0, offset - reviewLimit))}
                onNext={() => setReviewOffset((offset) => offset + reviewLimit)}
              />
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <TutorBookingSummaryCard tutor={tutor} />
            </div>
          </div>
        )}
      </ListState>
    </PageContainer>
  );
}
