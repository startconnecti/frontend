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
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
}

interface RawSessionTutor {
  tutorProfileId?: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email?: string;
}

interface RawSessionListItem {
  sessionId?: string;
  id?: string;
  sessionCode?: string;
  bookingId?: string;
  booking?: {
    id?: string;
    bookingCode?: string;
    code?: string;
  };
  studentId?: string;
  student?: RawSessionStudent;
  tutorId?: string;
  tutor?: RawSessionTutor;
  subjectName?: string;
  subject?: {
    id?: string;
    name?: string;
  };
  price?: number;
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
  if (lowerStatus === 'no_show') return 'no_show';
  if (lowerStatus === 'pending_payment') return 'pending_payment';
  if (lowerStatus === 'expired') return 'expired';
  if (lowerStatus === 'pending') return 'pending';
  
  return 'scheduled';
}

function normalizeSession(item: RawSessionListItem | null | undefined): AdminSessionListItem {
  if (!item) {
    return {
      id: '',
      sessionId: '',
      sessionCode: '-',
      bookingId: '',
      bookingCode: '-',
      studentId: '',
      studentName: '-',
      studentEmail: '-',
      tutorId: '',
      tutorName: '-',
      tutorEmail: '-',
      subjectName: '-',
      price: undefined,
      startTime: new Date(0).toISOString(),
      endTime: new Date(0).toISOString(),
      status: 'scheduled',
      meetingUrl: null,
      recordingUrl: null,
      createdAt: new Date(0).toISOString(),
      updatedAt: null,
    };
  }

  const generatedId = item.id ?? item.sessionId ?? '';

  return {
    id: generatedId,
    sessionId: item.sessionId ?? item.id ?? '',
    sessionCode: item.sessionCode ?? generatedId.substring(0, 8).toUpperCase(),
    bookingId: item.bookingId ?? item.booking?.id ?? '',
    bookingCode: item.booking?.bookingCode ?? item.booking?.code ?? '-',
    studentId: item.studentId ?? item.student?.id ?? item.student?.userId ?? '',
    studentName: item.student?.fullName ?? item.student?.name ?? '-',
    studentEmail: item.student?.email ?? '-',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? item.tutor?.userId ?? '',
    tutorName: item.tutor?.fullName ?? item.tutor?.name ?? '-',
    tutorEmail: item.tutor?.email ?? '-',
    subjectName: item.subjectName ?? item.subject?.name ?? '-',
    price: item.price,
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

    const response = await adminApi.get<any>(
      '/api/v1/admin/sessions',
      { params: buildParams(params) }
    );

    let rawItems: RawSessionListItem[] = [];
    let total = 0;
    let paginationData = null;

    if (Array.isArray(response)) {
      rawItems = response;
      total = response.length;
    } else if (response && typeof response === 'object') {
      rawItems = response.items ?? response.data ?? [];
      paginationData = response.pagination;
      total = paginationData?.total ?? rawItems.length;
    }

    const responseLimit = paginationData?.limit ?? limit;
    const offset = paginationData?.offset ?? (page - 1) * responseLimit;

    return {
      items: rawItems.map(normalizeSession).filter((session) => session.id),
      total,
      page,
      limit: responseLimit,
      offset,
      totalPages: Math.max(1, Math.ceil(total / responseLimit)),
    };
  },

  async getSessionById(id: string): Promise<any> {
    const response = await adminApi.get<any>(
      `/api/v1/admin/sessions/${id}`
    );
    return response;
  },

  async cancelSession(id: string, reason?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/sessions/${id}/cancel`, { reason });
  },

  async forceCompleteSession(id: string, reason?: string): Promise<void> {
    await adminApi.post(`/api/v1/admin/sessions/${id}/force-complete`, { note: reason });
  },
};
