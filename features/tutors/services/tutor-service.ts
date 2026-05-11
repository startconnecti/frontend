import { api } from '@/lib/api/client';
import { Tutor, TutorFilters } from '../types';

type TutorListResponse =
  | Tutor[]
  | {
    items?: Tutor[];
    data?: Tutor[];
    total?: number;
    meta?: unknown;
  };

type SubjectResponse =
  | string[]
  | {
    items?: Array<string | { id?: string; name?: string; slug?: string }>;
    data?: Array<string | { id?: string; name?: string; slug?: string }>;
  };

type TutorQueryParams = Record<string, string | number | boolean>;

export const FALLBACK_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Spanish',
  'French',
  'Computer Science',
  'History',
  'Geography',
];

function buildTutorQueryParams(filters: TutorFilters): TutorQueryParams {
  const params: TutorQueryParams = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    params[key] = value;
  });

  return params;
}

function normalizeTutorListResponse(response: TutorListResponse): Tutor[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

function normalizeSubjectResponse(response: SubjectResponse): string[] {
  const rawSubjects = Array.isArray(response)
    ? response
    : response.items ?? response.data ?? [];

  return rawSubjects
    .map((subject) => {
      if (typeof subject === 'string') {
        return subject;
      }

      return subject.name ?? subject.slug ?? subject.id ?? '';
    })
    .filter(Boolean);
}

export const tutorService = {
  async getTutors(filters: TutorFilters): Promise<Tutor[]> {
    const params = buildTutorQueryParams(filters);
    const response = await api.get<TutorListResponse>('/api/v1/tutors', { params });

    const tutors = normalizeTutorListResponse(response);

    return tutors.filter((tutor) => tutor.approvalStatus === 'approved' && tutor.isPublic);
  },

  async getTutorById(id: string, publicOnly = false): Promise<Tutor | null> {
    try {
      const tutor = await api.get<Tutor>(`/api/v1/tutors/${id}`);

      if (publicOnly && (tutor.approvalStatus !== 'approved' || !tutor.isPublic)) {
        return null;
      }

      return tutor;
    } catch {
      return null;
    }
  },

  async getSubjects(): Promise<string[]> {
    try {
      const response = await api.get<SubjectResponse>('/api/v1/subjects');
      const subjects = normalizeSubjectResponse(response);

      return subjects.length > 0 ? subjects : FALLBACK_SUBJECTS;
    } catch {
      return FALLBACK_SUBJECTS;
    }
  },
};