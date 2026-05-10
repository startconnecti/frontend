'use client';

import { useMutation } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding-service';
import { TutorOnboardingRequest } from '../types';

export function useCompleteTutorOnboardingMutation() {
  return useMutation({
    mutationFn: (request: TutorOnboardingRequest) => 
      onboardingService.completeTutorOnboarding(request),
  });
}
