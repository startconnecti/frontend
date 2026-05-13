import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSubjectsService } from '../services/admin-subjects-service';
import type { AdminSubjectsQueryParams } from '../types';

export const ADMIN_SUBJECTS_KEYS = {
  all: ['admin-subjects'] as const,
  lists: () => [...ADMIN_SUBJECTS_KEYS.all, 'list'] as const,
  list: (params: AdminSubjectsQueryParams) => [...ADMIN_SUBJECTS_KEYS.lists(), params] as const,
  details: () => [...ADMIN_SUBJECTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_SUBJECTS_KEYS.details(), id] as const,
};

export function useAdminSubjectsQuery(params: AdminSubjectsQueryParams) {
  return useQuery({
    queryKey: ADMIN_SUBJECTS_KEYS.list(params),
    queryFn: () => adminSubjectsService.listSubjects(params),
    staleTime: 30000,
  });
}

export function useAdminSubjectDetailQuery(id: string) {
  return useQuery({
    queryKey: ADMIN_SUBJECTS_KEYS.detail(id),
    queryFn: () => adminSubjectsService.getSubjectById(id),
    enabled: !!id,
  });
}

export function useCreateAdminSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug: string; description?: string; status: string }) =>
      adminSubjectsService.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBJECTS_KEYS.lists() });
    },
  });
}

export function useUpdateAdminSubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string; description?: string; status?: string } }) =>
      adminSubjectsService.updateSubject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBJECTS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBJECTS_KEYS.detail(data.id) });
    },
  });
}
