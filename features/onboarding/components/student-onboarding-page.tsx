'use client';

import Link from 'next/link';
import { User, Phone, Calendar, Info, ArrowRight } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

export function StudentOnboardingPage() {
  return (
    <PageContainer className="py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <SectionHeader 
          title="Complete your student profile" 
          description="Tell us a bit more about yourself so we can match you with the perfect tutors."
          align="center"
        />

        <Card className="border-border/60 shadow-xl shadow-primary/5 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg">Profile Information (Preview)</CardTitle>
            <CardDescription>This is a placeholder for the future onboarding form.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 opacity-60">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Personal Details</p>
                  <p className="text-xs text-muted-foreground">Full name, Phone number, Date of Birth, Gender</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 opacity-60">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Info className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Learning Goals</p>
                  <p className="text-xs text-muted-foreground">Subjects you're interested in, level of study</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
              <p className="text-sm text-muted-foreground italic">
                Form fields and validation logic will be implemented in the next phase.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-8">
            <Button size="lg" className="w-full sm:w-auto font-bold" disabled>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto" asChild>
              <Link href={ROUTES.STUDENT_DASHBOARD}>Continue to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <Button variant="link" className="text-muted-foreground" asChild>
            <Link href={ROUTES.LOGIN}>Back to Sign In</Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
