'use client';

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
  const { data: tutor, isLoading, error } = useTutorDetailQuery(id, true);

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
                reviewCount={tutor.reviewCount}
                hourlyRate={tutor.hourlyRate}
                experience={tutor.yearsOfExperience}
              />

              <TutorProfileAbout bio={tutor.bio} />

              <TutorProfileCertificates certificates={tutor.certificates} />

              <TutorProfileAvailability slots={tutor.availabilitySlots} />

              <TutorProfileReviews 
                feedbacks={tutor.feedbacks} 
                averageRating={tutor.averageRating} 
              />
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <TutorBookingSummaryCard hourlyRate={tutor.hourlyRate} />
            </div>
          </div>
        )}
      </ListState>
    </PageContainer>
  );
}
