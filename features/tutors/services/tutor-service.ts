import { api } from '@/lib/api/client';
import { ListResponse } from '@/lib/api/types';
import { Certificate, Tutor, TutorFilters, Subject } from '../types';

type TutorListResponse =
  | Tutor[]
  | {
    items?: Tutor[];
    data?: Tutor[];
    total?: number;
    limit?: number;
    offset?: number;
    pagination?: {
      total?: number;
      limit?: number;
      offset?: number;
    };
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
    if (value === undefined || value === null || value === '' || key === 'page') {
      return;
    }

    if (key === 'sortBy') {
      if (value !== 'recommended') params.sortedBy = value;
      return;
    }

    if (key === 'availabilityDay') {
      if (value !== 'all') params.availableDay = value;
      return;
    }

    params[key] = value;
  });

  return params;
}

/**
 * Normalizes a raw certification object into a stable Certificate shape.
 * Supports:
 *   OLD: { name, issuer, issuedAt, certificateUrl }
 *   NEW: { certificateName, issuingOrganization, issueDate, expiryDate, fileUrl }
 */
function normalizeCertification(raw: Record<string, unknown>): Certificate {
  const title =
    (raw.certificateName as string | undefined) ??
    (raw.name as string | undefined) ??
    (raw.title as string | undefined) ??
    '';

  const issuer =
    (raw.issuingOrganization as string | undefined) ??
    (raw.issuer as string | undefined) ??
    (raw.organization as string | undefined) ??
    '';

  const rawDate =
    (raw.issueDate as string | undefined) ??
    (raw.issuedAt as string | undefined) ??
    '';

  const yearMatch = rawDate.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

  const fileUrl =
    (raw.fileUrl as string | undefined) ??
    (raw.certificateUrl as string | undefined) ??
    (raw.url as string | undefined);

  const expiryDate =
    (raw.expiryDate as string | null | undefined) ?? null;

  return {
    id: (raw.id as string | undefined) ?? '',
    title,
    issuer,
    year,
    fileUrl,
    expiryDate,
  };
}

function normalizeTutor(tutor: Record<string, unknown>): Tutor {
  tutor = (tutor as Record<string, unknown>)?.tutor as Record<string, unknown> ?? tutor;
  if (!tutor) return tutor as unknown as Tutor;

  const rawCerts = Array.isArray(tutor.certificates)
    ? (tutor.certificates as Record<string, unknown>[])
    : Array.isArray(tutor.certifications)
      ? (tutor.certifications as Record<string, unknown>[])
      : [];

  const certificates = rawCerts.map(normalizeCertification);

  const availabilitySlots = Array.isArray(tutor.availabilitySlots)
    ? tutor.availabilitySlots
    : Array.isArray(tutor.weeklyAvailability)
      ? tutor.weeklyAvailability
      : [];

  const rawSubjectItems: unknown[] = Array.isArray(tutor.subjects) ? (tutor.subjects as unknown[]) : [];
  // subjectObjects: preserve full {id, name} when the API returns objects
  const subjectObjects = rawSubjectItems
    .filter((s) => s && typeof s === 'object' && (s as Record<string, unknown>).id)
    .map((s) => ({
      id: (s as Record<string, unknown>).id as string,
      name: ((s as Record<string, unknown>).name ?? (s as Record<string, unknown>).slug ?? '') as string,
    }));
  // subjects: flat name strings for display
  const subjects = rawSubjectItems
    .map((s) => (typeof s === 'string' ? s : (s as Record<string, unknown>).name ?? (s as Record<string, unknown>).slug ?? ''))
    .filter((s): s is string => Boolean(s));

  return {
    ...(tutor as Partial<Tutor>),
    id: (tutor.id as string | undefined) ?? (tutor.tutorId as string | undefined) ?? '',
    fullName: (tutor.fullName as string | undefined) ?? (tutor.name as string | undefined) ?? '-',
    avatarUrl: (tutor.avatarUrl as string | undefined) ?? (tutor.avatar as string | undefined) ?? undefined,
    bio: (tutor.bio as string | undefined) ?? '',
    experienceText: (tutor.experienceText as string | undefined) ?? '',
    subjects,
    subjectObjects: subjectObjects.length > 0 ? subjectObjects : undefined,
    approvalStatus: (tutor.approvalStatus as Tutor['approvalStatus']) ?? 'approved',
    approvalNote: (tutor.approvalNote as string | undefined) ?? undefined,
    isPublic: (tutor.isPublic as boolean | undefined) ?? true,
    certificates,
    certifications: certificates,
    availabilitySlots: availabilitySlots as Tutor['availabilitySlots'],
    weeklyAvailability: availabilitySlots as Tutor['weeklyAvailability'],
    feedbacks: Array.isArray(tutor.feedbacks) ? (tutor.feedbacks as Tutor['feedbacks']) : [],
    hourlyRate: Number(tutor.hourlyRate) || 0,
    averageRating: Number((tutor.averageRating as unknown) ?? (tutor.ratingAvg as unknown)) || 0,
    reviewCount: Number((tutor.totalReviews as unknown) ?? (tutor.reviewCount as unknown)) || 0,
    totalReviews: Number((tutor.totalReviews as unknown) ?? (tutor.reviewCount as unknown)) || 0,
    yearsOfExperience: Number(tutor.yearsOfExperience) || 0,
    isFavorite: Boolean(tutor.isFavorite),
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

function normalizeTutorListPage(response: TutorListResponse, filters: TutorFilters): ListResponse<Tutor> {
  const items = normalizeTutorListResponse(response);

  if (Array.isArray(response)) {
    return {
      items,
      total: response.length,
      limit: filters.limit ?? response.length,
      offset: filters.offset ?? 0,
    };
  }

  const pagination = response?.pagination;
  return {
    items,
    total: response?.total ?? pagination?.total ?? items.length,
    limit: response?.limit ?? pagination?.limit ?? filters.limit ?? items.length,
    offset: response?.offset ?? pagination?.offset ?? filters.offset ?? 0,
  };
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
  async getTutorList(filters: TutorFilters): Promise<ListResponse<Tutor>> {
    const params = buildTutorQueryParams(filters);
    const response = await api.get<TutorListResponse>('/api/v1/tutors', { params });
    const page = normalizeTutorListPage(response, filters);

    let tutors = page.items.filter((tutor) => tutor.approvalStatus === 'approved' && tutor.isPublic);

    const sortKey = filters.sortedBy ?? filters.sortBy;

    if (sortKey) {
      tutors = [...tutors].sort((a, b) => {
        switch (sortKey) {
          case 'oldest':
            return a.id.localeCompare(b.id);
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'rate_low':
            return a.hourlyRate - b.hourlyRate;
          case 'rate_high':
            return b.hourlyRate - a.hourlyRate;
          case 'price_low':
            return ((a as any).totalPrice ?? a.hourlyRate) - ((b as any).totalPrice ?? b.hourlyRate);
          case 'price_high':
            return ((b as any).totalPrice ?? b.hourlyRate) - ((a as any).totalPrice ?? a.hourlyRate);
          default:
            return 0;
        }
      });
    }

    return { ...page, items: tutors };
  },

  async getTutors(filters: TutorFilters): Promise<Tutor[]> {
    const response = await this.getTutorList(filters);
    return response.items;
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
