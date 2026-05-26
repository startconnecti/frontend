import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { changeRequestService } from '../services/change-request-service';
import { GetChangeRequestsParams } from '../types';
import { buildTutorProfileSnapshotPayload, DraftSnapshotPayload } from '../utils/snapshot-mapper';

export const TUTOR_PROFILE_CHANGE_REQUESTS_KEY = ['tutor-profile-change-requests'];

export function useTutorProfileChangeRequestsQuery(params?: GetChangeRequestsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...TUTOR_PROFILE_CHANGE_REQUESTS_KEY, params],
    queryFn: () => changeRequestService.getChangeRequests(params),
    ...options,
  });
}

export function useCreateTutorProfileChangeRequestMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: { snapshot: DraftSnapshotPayload; request_note?: string }) => {
      // The mapper layer structurally validates and builds the EXACT multipart FormData payload
      const formData = buildTutorProfileSnapshotPayload(payload.snapshot, payload.request_note);
      return changeRequestService.createChangeRequest(formData);
    },
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
