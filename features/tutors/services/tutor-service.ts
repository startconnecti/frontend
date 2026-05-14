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

function normalizeTutor(tutor: any): Tutor {
  if (!tutor) return tutor;
  return {
    ...tutor,
    fullName: tutor.fullName ?? tutor.name ?? '-',
    avatarUrl: tutor.avatarUrl ?? tutor.avatar ?? undefined,
    subjects: Array.isArray(tutor.subjects) ? tutor.subjects : [],
    certificates: Array.isArray(tutor.certificates) ? tutor.certificates : [],
    availabilitySlots: Array.isArray(tutor.availabilitySlots) ? tutor.availabilitySlots : [],
    feedbacks: Array.isArray(tutor.feedbacks) ? tutor.feedbacks : [],
    hourlyRate: Number(tutor.hourlyRate) || 0,
    averageRating: Number(tutor.averageRating) || 0,
    reviewCount: Number(tutor.reviewCount) || 0,
    yearsOfExperience: Number(tutor.yearsOfExperience) || 0,
  };
}

function normalizeTutorListResponse(response: TutorListResponse): Tutor[] {
  let rawItems: Tutor[] = [];
  
  if (Array.isArray(response)) {
    rawItems = response;
  } else if (response && typeof response === 'object') {
    rawItems = response.items ?? response.data ?? [];
  }

  return rawItems.map(normalizeTutor);
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
      const response = await api.get<any>(`/api/v1/tutors/${id}`);
      const tutor = normalizeTutor(response);

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