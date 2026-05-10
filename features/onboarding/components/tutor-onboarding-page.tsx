'use client';

import Link from 'next/link';
import { User, GraduationCap, Award, Calendar, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

export function TutorOnboardingPage() {
  const steps = [
    { icon: User, title: 'Personal Information', desc: 'Identity and contact details' },
    { icon: GraduationCap, title: 'Teaching Bio', desc: 'Experience and teaching style' },
    { icon: DollarSign, title: 'Subjects & Rates', desc: 'Expertise and hourly pricing' },
    { icon: Award, title: 'Certificates', desc: 'Verification of your credentials' },
    { icon: Calendar, title: 'Availability', desc: 'Weekly teaching schedule' },
    { icon: ShieldCheck, title: 'Submit for Approval', desc: 'Review by our moderation team' },
  ];

  return (
    <PageContainer className="py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <SectionHeader 
          title="Complete your tutor profile" 
          description="Follow these steps to set up your professional profile and start teaching."
          align="center"
        />

        <Card className="border-border/60 shadow-xl shadow-primary/5 overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg">Application Workflow (Preview)</CardTitle>
            <CardDescription>You will need to complete all sections before appearing in search.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/60 opacity-60">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Step {index + 1}: {step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/40 text-center">
              <p className="text-sm text-muted-foreground italic">
                A multi-step application form will be implemented in the next phase.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-8">
            <Button size="lg" className="w-full sm:w-auto font-bold" disabled>
              Start Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto" asChild>
              <Link href={ROUTES.TUTOR_DASHBOARD}>Continue to Dashboard</Link>
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
