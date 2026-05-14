'use client';

import Link from 'next/link';
import { ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';
import { PageContainer, SectionHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { TutorOnboardingForm } from './tutor-onboarding-form';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function TutorOnboardingPage() {
  const { user, logout, updateUser } = useAuthStore();
  const router = useRouter();
  
  const isTutorReady = user?.role === 'tutor' && (user.onboardingCompleted || user.hasProfile || user.tutorProfileStatus);

  const handleLeave = () => {
    if (isTutorReady) {
      router.push(ROUTES.TUTOR_DASHBOARD);
    } else {
      updateUser({ onboardingSkipped: true });
      router.push(ROUTES.TUTOR_DASHBOARD);
    }
  };

  return (
    <PageContainer className="py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <SectionHeader 
          title="Become a Connecti Tutor" 
          description="Fill out your professional profile and application to start teaching on our platform."
        />

        <TutorOnboardingForm />

        <div className="text-center">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleLeave}>
            {isTutorReady ? (
              <>
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" />
                Skip for now
              </>
            )}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
