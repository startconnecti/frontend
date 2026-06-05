'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding-service';
import { handleMutationError } from '@/lib/api/query-utils';

export function useSubmitTutorOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => onboardingService.submitTutorOnboarding(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-profile'] });
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to submit onboarding. Please try again.');
    },
  });
}
