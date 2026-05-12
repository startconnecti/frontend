import { PAGINATION } from '@/constants/pagination';
import { adminApi } from '@/lib/admin-api/client';
import {
  AdminSessionListItem,
  AdminSessionStatus,
  AdminSessionsListResponse,
  AdminSessionsQueryParams,
} from '../types';

type AdminSessionsRequestParams = Record<string, string | number | boolean>;

interface RawSessionStudent {
  userId?: string;
  name?: string;
  email?: string;
}

interface RawSessionTutor {
  tutorProfileId?: string;
  name?: string;
  email?: string;
}

interface RawSessionListItem {
  sessionId?: string;
  id?: string;
  bookingId?: string;
  studentId?: string;
  student?: RawSessionStudent;
  tutorId?: string;
  tutor?: RawSessionTutor;
  subjectName?: string;
  subject?: {
    name?: string;
  };
  startTime?: string;
  endTime?: string;
  status?: string;
  meetingUrl?: string | null;
  joinLink?: string | null;
  recordingUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface RawSessionsListResponse {
  items?: RawSessionListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

function normalizeSessionStatus(status?: string): AdminSessionStatus {
  if (!status) return 'scheduled';
  
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'scheduled') return 'scheduled';
  if (lowerStatus === 'ongoing' || lowerStatus === 'in_progress' || lowerStatus === 'active') return 'ongoing';
  if (lowerStatus === 'completed' || lowerStatus === 'finished' || lowerStatus === 'done') return 'completed';
  if (lowerStatus === 'cancelled') return 'cancelled';
  
  return 'scheduled';
}

function normalizeSession(item: RawSessionListItem): AdminSessionListItem {
  return {
    id: item.id ?? item.sessionId ?? '',
    bookingId: item.bookingId ?? '',
    studentId: item.studentId ?? item.student?.userId ?? '',
    studentName: item.student?.name ?? '-',
    studentEmail: item.student?.email ?? '-',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? '',
    tutorName: item.tutor?.name ?? '-',
    tutorEmail: item.tutor?.email ?? '-',
    subjectName: item.subjectName ?? item.subject?.name ?? '-',
    startTime: item.startTime ?? new Date(0).toISOString(),
    endTime: item.endTime ?? new Date(0).toISOString(),
    status: normalizeSessionStatus(item.status),
    meetingUrl: item.meetingUrl ?? item.joinLink ?? null,
    recordingUrl: item.recordingUrl ?? null,
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
  };
}

function buildParams(params: AdminSessionsQueryParams): AdminSessionsRequestParams {
  const requestParams: AdminSessionsRequestParams = {};

  if (params.keyword) requestParams.keyword = params.keyword;
  if (params.status) requestParams.status = params.status;

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

  return requestParams;
}

export const adminSessionsService = {
  async getSessions(params: AdminSessionsQueryParams): Promise<AdminSessionsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit =
      params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

    const response = await adminApi.get<RawSessionsListResponse>(
      '/api/v1/admin/sessions',
      { params: buildParams(params) }
    );

    const items = response.items ?? [];
    const pagination = response.pagination;
    const total = pagination?.total ?? items.length;
    const responseLimit = pagination?.limit ?? limit;
    const offset = pagination?.offset ?? (page - 1) * responseLimit;

    return {
      items: items.map(normalizeSession).filter((session) => session.id),
      total,
      page,
      limit: responseLimit,
      offset,
      totalPages: Math.max(1, Math.ceil(total / responseLimit)),
    };
  },
};
