'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { StudentOnboardingForm } from './student-onboarding-form';

export function StudentOnboardingPage() {
  return (
    <PageContainer className="py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <SectionHeader 
          title="Complete your student profile" 
          description="Tell us a bit more about yourself so we can match you with the perfect tutors."
          align="center"
        />

        <Card className="border-border/60 shadow-xl shadow-primary/5">
          <CardHeader className="bg-primary/5 border-b border-primary/10 pb-6">
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              This information helps us personalize your experience and improve tutor matches.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <StudentOnboardingForm />
          </CardContent>
        </Card>

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
