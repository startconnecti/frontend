'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding-service';
import { StudentOnboardingRequest } from '../types';

export function useCompleteStudentOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StudentOnboardingRequest) => 
      onboardingService.completeStudentOnboarding(request),
    onSuccess: () => {
      // In a real app, we might invalidate user queries here
      // For now, we just return success to the component
    },
  });
}
