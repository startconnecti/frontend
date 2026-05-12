import { PAGINATION } from '@/constants/pagination';
import { adminApi } from '@/lib/admin-api/client';
import {
  AdminBookingDetail,
  AdminBookingListItem,
  AdminBookingStatus,
  AdminBookingsListResponse,
  AdminBookingsQueryParams,
  AdminPaymentStatus,
} from '../types';

type AdminBookingsRequestParams = Record<string, string | number | boolean>;

interface RawBookingStudent {
  userId?: string;
  name?: string;
  email?: string;
}

interface RawBookingTutor {
  tutorProfileId?: string;
  name?: string;
  email?: string;
}

interface RawBookingListItem {
  bookingId?: string;
  id?: string;
  studentId?: string;
  student?: RawBookingStudent;
  tutorId?: string;
  tutor?: RawBookingTutor;
  subjectName?: string;
  subject?: {
    name?: string;
  };
  startTime?: string;
  endTime?: string;
  status?: string;
  paymentStatus?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface RawBookingsListResponse {
  items?: RawBookingListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
}

interface RawBookingDetailResponse {
  booking?: RawBookingListItem & {
    description?: string | null;
    notes?: string | null;
  };
}

function normalizeBookingStatus(status?: string): AdminBookingStatus {
  if (!status) return 'pending';
  
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending' || lowerStatus === 'pending_payment') return 'pending';
  if (lowerStatus === 'confirmed' || lowerStatus === 'approved') return 'confirmed';
  if (lowerStatus === 'completed' || lowerStatus === 'finished') return 'completed';
  if (lowerStatus === 'cancelled') return 'cancelled';
  
  return 'pending';
}

function normalizePaymentStatus(status?: string): AdminPaymentStatus {
  if (!status) return 'pending';
  
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'pending') return 'pending';
  if (lowerStatus === 'paid' || lowerStatus === 'succeeded' || lowerStatus === 'processing') return 'paid';
  if (lowerStatus === 'failed') return 'failed';
  if (lowerStatus === 'refunded' || lowerStatus === 'refunding') return 'refunded';
  
  return 'pending';
}

function normalizeBooking(item: RawBookingListItem | null | undefined): AdminBookingListItem {
  if (!item) {
    return {
      id: '',
      studentId: '',
      studentName: '-',
      studentEmail: '-',
      tutorId: '',
      tutorName: '-',
      tutorEmail: '-',
      subjectName: '-',
      startTime: new Date(0).toISOString(),
      endTime: new Date(0).toISOString(),
      status: 'pending',
      paymentStatus: 'pending',
      amount: 0,
      createdAt: new Date(0).toISOString(),
      updatedAt: null,
    };
  }

  return {
    id: item.id ?? item.bookingId ?? '',
    studentId: item.studentId ?? item.student?.userId ?? '',
    studentName: item.student?.name ?? '-',
    studentEmail: item.student?.email ?? '-',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? '',
    tutorName: item.tutor?.name ?? '-',
    tutorEmail: item.tutor?.email ?? '-',
    subjectName: item.subjectName ?? item.subject?.name ?? '-',
    startTime: item.startTime ?? new Date(0).toISOString(),
    endTime: item.endTime ?? new Date(0).toISOString(),
    status: normalizeBookingStatus(item.status),
    paymentStatus: normalizePaymentStatus(item.paymentStatus),
    amount: item.amount ?? 0,
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    updatedAt: item.updatedAt ?? null,
  };
}

function buildParams(params: AdminBookingsQueryParams): AdminBookingsRequestParams {
  const requestParams: AdminBookingsRequestParams = {};

  if (params.keyword) requestParams.keyword = params.keyword;
  if (params.status) requestParams.status = params.status;

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit =
    params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

  requestParams.limit = limit;
  requestParams.offset = (page - 1) * limit;

  return requestParams;
}

export const adminBookingsService = {
  async getBookings(params: AdminBookingsQueryParams): Promise<AdminBookingsListResponse> {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit =
      params.limit && params.limit > 0 ? params.limit : PAGINATION.DEFAULT_PAGE_SIZE;

    const response = await adminApi.get<any>(
      '/api/v1/admin/bookings',
      { params: buildParams(params) }
    );

    let rawItems: RawBookingListItem[] = [];
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
      items: rawItems.map(normalizeBooking).filter((booking) => booking.id),
      total,
      page,
      limit: responseLimit,
      offset,
      totalPages: Math.max(1, Math.ceil(total / responseLimit)),
    };
  },

  async getBookingById(id: string): Promise<AdminBookingDetail> {
    const response = await adminApi.get<RawBookingDetailResponse>(
      `/api/v1/admin/bookings/${id}`
    );

    if (!response || !response.booking) {
      throw new Error('Booking response is missing booking');
    }

    const normalized = normalizeBooking(response.booking);

    return {
      ...normalized,
      student: {
        id: response.booking.studentId ?? response.booking.student?.userId ?? '',
        name: response.booking.student?.name ?? '-',
        email: response.booking.student?.email ?? '-',
      },
      tutor: {
        id: response.booking.tutorId ?? response.booking.tutor?.tutorProfileId ?? '',
        name: response.booking.tutor?.name ?? '-',
        email: response.booking.tutor?.email ?? '-',
      },
      description: response.booking.description ?? null,
      notes: response.booking.notes ?? null,
    };
  },
};
