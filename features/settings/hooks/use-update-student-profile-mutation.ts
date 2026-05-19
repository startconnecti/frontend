'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings-service';
import { toast } from 'sonner';
import { handleMutationError } from '@/lib/api/query-utils';

export function useUpdateStudentProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subjectIds: string[]) => settingsService.updateStudentProfile(subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-profile'] });
      toast.success('Favorite subjects updated successfully');
    },
    onError: (error) => {
      handleMutationError(error, 'Failed to update student profile');
    },
  });
}
