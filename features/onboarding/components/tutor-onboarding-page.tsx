'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { TutorOnboardingForm } from './tutor-onboarding-form';

export function TutorOnboardingPage() {
  return (
    <PageContainer className="py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <SectionHeader 
          title="Become a Connecti Tutor" 
          description="Fill out your professional profile and application to start teaching on our platform."
          align="center"
        />

        <TutorOnboardingForm />

        <div className="text-center">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" asChild>
            <Link href={ROUTES.LOGIN}>
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
