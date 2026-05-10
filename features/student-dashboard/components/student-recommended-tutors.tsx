'use client';

import { TutorCard } from '@/components/client/tutor-card';
import { Tutor } from '@/features/tutors/types';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

interface StudentRecommendedTutorsProps {
  tutors: Tutor[];
}

export function StudentRecommendedTutors({ tutors }: StudentRecommendedTutorsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold" style={{ color: '#2C1208' }}>Recommended for You</h3>
        <Button variant="ghost" className="text-primary font-bold gap-2" asChild>
          <Link href={ROUTES.DISCOVER}>
            View More
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutors.map((tutor) => (
          <TutorCard 
            key={tutor.id} 
            id={tutor.id}
            name={tutor.fullName}
            title={tutor.title}
            expertise={tutor.subjects}
            rating={tutor.rating}
            reviews={tutor.reviewCount}
            hourlyRate={tutor.hourlyRate}
            bio={tutor.bio}
            avatar={tutor.avatar}
          />
        ))}
      </div>
    </div>
  );
}
