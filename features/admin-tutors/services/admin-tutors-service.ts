import { PAGINATION } from '@/constants/pagination';
import { adminApi } from '@/lib/admin-api/client';
import {
  AdminTutorDetail,
  AdminTutorListItem,
  AdminTutorProfileStatus,
  AdminTutorsListResponse,
  AdminTutorsQueryParams,
} from '../types';

type AdminTutorsRequestParams = Record<string, string | number | boolean>;

interface RawSubject {
  id?: string;
  name?: string;
}

interface RawTutorListItem {
  tutorProfileId?: string;
  id?: string;
  userId?: string;
  fullName?: string;
  email?: string;
  profileStatus?: string;
  hourlyRate?: number;
  subjects?: RawSubject[];
  createdAt?: string;
  updatedAt?: string;
}

interface RawTutorsListResponse {
  items?: RawTutorListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

interface RawTutorDetailResponse {
  tutorProfile?: RawTutorListItem & {
    bio?: string | null;
    experienceText?: string | null;
    approvalNote?: string | null;
    certifications?: AdminTutorDetail['certifications'];
  };
}

function isTutorStatus(status?: string): status is AdminTutorProfileStatus {
  return status === 'pending' || status === 'approved' || status === 'rejected';
}

function normalizeSubjects(subjects?: RawSubject[]) {
  return (subjects ?? [])
    .map((subject) => ({
      id: subject.id ?? subject.name ?? '',
      name: subject.name ?? '-',
    }))
    .filter((subject) => subject.id);
}

function normalizeTutor(item: RawTutorListItem): AdminTutorListItem {
  return {
    id: item.id ?? item.tutorProfileId ?? '',
    userId: item.userId ?? '',
    fullName: item.fullName ?? '-',
    email: item.email ?? '-',
    profileStatus: isTutorStatus(item.profileStatus) ? item.profileStatus : 'pending',
    hourlyRate: item.hourlyRate ?? 0,
    subjects: normalizeSubjects(item.subjects),
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
  };
}

function buildParams(params: AdminTutorsQueryParams): AdminTutorsRequestParams {
  const requestParams: AdminTutorsRequestParams = {};

  if (params.keyword) requestParams.keyword = params.keyword;
  if (params.status) requestParams.status = params.status;

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

  return requestParams;
}

export const adminTutorsService = {
  async getTutors(params: AdminTutorsQueryParams): Promise<AdminTutorsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit =
      params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

    const response = await adminApi.get<RawTutorsListResponse>(
      '/api/v1/admin/tutor-profiles',
      { params: buildParams(params) }
    );

    const items = response.items ?? [];
    const pagination = response.pagination;
    const total = pagination?.total ?? items.length;
    const responseLimit = pagination?.limit ?? limit;
    const offset = pagination?.offset ?? (page - 1) * responseLimit;

    return {
      items: items.map(normalizeTutor).filter((tutor) => tutor.id),
      total,
      page,
      limit: responseLimit,
      offset,
      totalPages: Math.max(1, Math.ceil(total / responseLimit)),
    };
  },

  async getTutorById(id: string): Promise<AdminTutorDetail> {
    const response = await adminApi.get<RawTutorDetailResponse>(
      `/api/v1/admin/tutor-profiles/${id}`
    );

    if (!response.tutorProfile) {
      throw new Error('Tutor profile response is missing tutorProfile');
    }

    const normalized = normalizeTutor(response.tutorProfile);

    return {
      ...normalized,
      bio: response.tutorProfile.bio ?? null,
      experienceText: response.tutorProfile.experienceText ?? null,
      approvalNote: response.tutorProfile.approvalNote ?? null,
      certifications: response.tutorProfile.certifications ?? [],
    };
  },
};