import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { changeRequestService } from '../services/change-request-service';
import { GetChangeRequestsParams } from '../types';

export const TUTOR_PROFILE_CHANGE_REQUESTS_KEY = ['tutor-profile-change-requests'];

export function useTutorProfileChangeRequestsQuery(params?: GetChangeRequestsParams) {
  return useQuery({
    queryKey: [...TUTOR_PROFILE_CHANGE_REQUESTS_KEY, params],
    queryFn: () => changeRequestService.getChangeRequests(params),
  });
}

export function useCreateTutorProfileChangeRequestMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: { change_payload: any; request_note?: string }) => 
      changeRequestService.createChangeRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_PROFILE_CHANGE_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['tutor-profile'] });
    },
  });
}

export function useUpdateTutorProfileChangeRequestMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { change_payload: any; request_note?: string } }) => 
      changeRequestService.updateChangeRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_PROFILE_CHANGE_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['tutor-profile'] });
    },
  });
}

export function useCancelTutorProfileChangeRequestMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => changeRequestService.deleteChangeRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TUTOR_PROFILE_CHANGE_REQUESTS_KEY });
      queryClient.invalidateQueries({ queryKey: ['tutor-profile'] });
    },
  });
}
