import { api } from '@/lib/api/client';
import { Tutor, TutorFilters, Subject } from '../types';

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
    items?: Array<string | { id?: string; name?: string; slug?: string; status?: string; isActive?: boolean }>;
    data?: Array<string | { id?: string; name?: string; slug?: string; status?: string; isActive?: boolean }>;
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
    // Exclude sortBy as it is not currently supported by the backend tutors API
    if (value === undefined || value === null || value === '' || key === 'sortBy') {
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
    id: tutor.id ?? tutor.tutorId ?? '',
    fullName: tutor.fullName ?? tutor.name ?? '-',
    avatarUrl: tutor.avatarUrl ?? tutor.avatar ?? undefined,
    subjects: Array.isArray(tutor.subjects)
      ? tutor.subjects.map((s: any) => (typeof s === 'string' ? s : s.name ?? s.slug ?? '')).filter(Boolean)
      : [],
    approvalStatus: tutor.approvalStatus ?? 'approved',
    isPublic: tutor.isPublic ?? true,
    certificates: Array.isArray(tutor.certificates) ? tutor.certificates : [],
    availabilitySlots: Array.isArray(tutor.availabilitySlots) ? tutor.availabilitySlots : [],
    feedbacks: Array.isArray(tutor.feedbacks) ? tutor.feedbacks : [],
    hourlyRate: Number(tutor.hourlyRate) || 0,
    averageRating: Number(tutor.averageRating ?? tutor.ratingAvg) || 0,
    reviewCount: Number(tutor.reviewCount ?? tutor.totalReviews) || 0,
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

function normalizeSubjectResponse(response: any): Subject[] {
  let rawSubjects: any[] = [];

  if (Array.isArray(response)) {
    rawSubjects = response;
  } else if (response && typeof response === 'object') {
    if (Array.isArray(response.items)) {
      rawSubjects = response.items;
    } else if (response.data) {
      if (Array.isArray(response.data)) {
        rawSubjects = response.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        rawSubjects = response.data.items;
      }
    }
  }

  return rawSubjects
    .filter((subject) => {
      if (typeof subject === 'string') return true;
      if (subject.status !== undefined && subject.status !== 'active') return false;
      if (subject.isActive !== undefined && !subject.isActive) return false;
      return true;
    })
    .map((subject) => {
      if (typeof subject === 'string') {
        return { id: subject.toLowerCase(), name: subject };
      }

      return {
        id: subject.id ?? subject.slug ?? '',
        name: subject.name ?? subject.slug ?? subject.id ?? '',
        slug: subject.slug,
        status: subject.status,
        isActive: subject.isActive,
      };
    })
    .filter((s) => s.id && s.name);
}

export const tutorService = {
  async getTutors(filters: TutorFilters): Promise<Tutor[]> {
    const params = buildTutorQueryParams(filters);
    const response = await api.get<TutorListResponse>('/api/v1/tutors', { params });

    let tutors = normalizeTutorListResponse(response);

    // Filter by approval status and public visibility first
    tutors = tutors.filter((tutor) => tutor.approvalStatus === 'approved' && tutor.isPublic);

    // Apply client-side sorting since the backend doesn't support sortBy
    if (filters.sortBy) {
      tutors = [...tutors].sort((a, b) => {
        switch (filters.sortBy) {
          case 'highest_rating':
            return b.averageRating - a.averageRating;
          case 'lowest_price':
            return a.hourlyRate - b.hourlyRate;
          case 'highest_price':
            return b.hourlyRate - a.hourlyRate;
          case 'most_reviewed':
            return b.reviewCount - a.reviewCount;
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'recommended':
          default:
            return 0;
        }
      });
    }

    return tutors;
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

  async getSubjects(): Promise<Subject[]> {
    try {
      const response = await api.get<any>('/api/v1/subjects');
      const subjects = normalizeSubjectResponse(response);

      return subjects.length > 0
        ? subjects
        : FALLBACK_SUBJECTS.map((s) => ({ id: s.toLowerCase(), name: s }));
    } catch {
      return FALLBACK_SUBJECTS.map((s) => ({ id: s.toLowerCase(), name: s }));
    }
  },
};