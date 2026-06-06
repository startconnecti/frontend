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
      const dashboard = user?.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
      router.push(dashboard);
      return;
    }

    // 3. Onboarding Check — block access to protected pages if onboarding incomplete
    if (requireOnboarding && user) {
      // For tutors: sole source of truth is onboardingCompleted
      const isTutorIncomplete = user.role === 'tutor' && !user.onboardingCompleted;
      // For students: onboardingCompleted or hasProfile or skipped counts as complete
      const isStudentIncomplete = user.role === 'student' && !user.onboardingCompleted && !user.hasProfile && !user.onboardingSkipped;

      if (isTutorIncomplete || isStudentIncomplete) {
        const onboardingPath = user.role === 'tutor' ? ROUTES.ONBOARDING_TUTOR : ROUTES.ONBOARDING_STUDENT;
        if (pathname !== onboardingPath) {
          router.replace(onboardingPath);
        }
        return;
      }
    }

    // 4. Prevent Re-onboarding — redirect away from onboarding if already completed
    if (user) {
      const isTutorComplete = user.role === 'tutor' && user.onboardingCompleted;
      const isStudentComplete = user.role === 'student' && (user.onboardingCompleted || user.hasProfile);

      if (isTutorComplete || isStudentComplete) {
        const onboardingPathStudent = ROUTES.ONBOARDING_STUDENT;
        const onboardingPathTutor = ROUTES.ONBOARDING_TUTOR;
        if (pathname === onboardingPathStudent || pathname === onboardingPathTutor) {
          const dashboard = user.role === 'tutor' ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
          router.replace(dashboard);
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

  // Final render-gate: suppress children during redirects to avoid content flash
  if (allowedRole && user?.role !== allowedRole) return null;

  if (requireOnboarding && user) {
    const isTutorIncomplete = user.role === 'tutor' && !user.onboardingCompleted;
    const isStudentIncomplete = user.role === 'student' && !user.onboardingCompleted && !user.hasProfile && !user.onboardingSkipped;
    if (isTutorIncomplete || isStudentIncomplete) {
      if (pathname !== (user.role === 'tutor' ? ROUTES.ONBOARDING_TUTOR : ROUTES.ONBOARDING_STUDENT)) {
        return null;
      }
    }
  }

  return <>{children}</>;
}
