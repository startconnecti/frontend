'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/constants/routes';
import { LoadingState } from './loading-state';

interface RouteGuardProps {
  children: ReactNode;
  allowedRole?: 'student' | 'tutor';
  requireOnboarding?: boolean;
}

export function RouteGuard({ 
  children, 
  allowedRole, 
  requireOnboarding = true 
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    // 1. Basic Auth Check
    if (!isAuthenticated) {
      const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // 2. Role Check
    if (allowedRole && user?.role !== allowedRole) {
      // Redirect to correct dashboard if wrong role
      const dashboard = user?.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
      router.push(dashboard);
      return;
    }

    // 3. Onboarding Check
    if (requireOnboarding && user) {
      const isStudentIncomplete = user.role === 'student' && !user.onboardingCompleted;
      const isTutorIncomplete = user.role === 'tutor' && !user.onboardingCompleted && !user.hasTutorProfile;
      
      if (isStudentIncomplete || isTutorIncomplete) {
        // Check if already on onboarding page to avoid loop
        const onboardingPath = user.role === 'tutor' ? ROUTES.ONBOARDING_TUTOR : ROUTES.ONBOARDING_STUDENT;
        if (pathname !== onboardingPath) {
          router.push(onboardingPath);
        }
        return;
      }
    }

    // 4. Prevent Re-onboarding if already completed
    if (user) {
      const isStudentComplete = user.role === 'student' && user.onboardingCompleted;
      const isTutorComplete = user.role === 'tutor' && (user.onboardingCompleted || user.hasTutorProfile);
      
      if (isStudentComplete || isTutorComplete) {
        const onboardingPathStudent = ROUTES.ONBOARDING_STUDENT;
        const onboardingPathTutor = ROUTES.ONBOARDING_TUTOR;
        if (pathname === onboardingPathStudent || pathname === onboardingPathTutor) {
          const dashboard = user.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
          router.push(dashboard);
        }
      }
    }
  }, [isHydrated, isAuthenticated, user, allowedRole, requireOnboarding, pathname, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState type="page" />
      </div>
    );
  }

  // Final check for role before rendering children to avoid flash of content
  if (allowedRole && user?.role !== allowedRole) return null;
  if (requireOnboarding && user) {
    const isStudentIncomplete = user.role === 'student' && !user.onboardingCompleted;
    const isTutorIncomplete = user.role === 'tutor' && !user.onboardingCompleted && !user.hasTutorProfile;
    if (isStudentIncomplete || isTutorIncomplete) {
      if (pathname !== (user.role === 'tutor' ? ROUTES.ONBOARDING_TUTOR : ROUTES.ONBOARDING_STUDENT)) {
        return null;
      }
    }
  }

  return <>{children}</>;
}
