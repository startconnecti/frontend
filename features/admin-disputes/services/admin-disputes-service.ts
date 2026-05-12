import { adminApi } from '@/lib/admin-api/client';
import type {
  AdminDisputeListItem,
  AdminDisputeListQueryParams,
  AdminDisputeListResponse,
  AdminDisputeStatus,
  AdminDisputePriority,
} from '../types';

interface RawDisputeListItem {
  id?: string;
  disputeId?: string;
  bookingId?: string;
  sessionId?: string;
  studentId?: string;
  student?: {
    userId?: string;
    name?: string;
    email?: string;
  };
  studentName?: string;
  studentEmail?: string;
  tutorId?: string;
  tutor?: {
    tutorProfileId?: string;
    name?: string;
    email?: string;
  };
  tutorName?: string;
  tutorEmail?: string;
  subject?: string;
  description?: string;
  status?: string;
  priority?: string;
  resolution?: string;
  createdAt?: string;
  resolvedAt?: string;
  updatedAt?: string;
}

interface RawDisputeListResponse {
  items?: RawDisputeListItem[];
  data?: RawDisputeListItem[];
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
  };
  total?: number;
  limit?: number;
  offset?: number;
}

function normalizeDisputeStatus(status?: string): AdminDisputeStatus {
  if (!status) return 'open';

  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'open') return 'open';
  if (lowerStatus === 'under_review' || lowerStatus === 'in_review') return 'under_review';
  if (lowerStatus === 'resolved' || lowerStatus === 'closed') return 'resolved';
  if (lowerStatus === 'rejected') return 'rejected';
  if (lowerStatus === 'cancelled') return 'cancelled';

  return 'open';
}

function normalizeDisputePriority(priority?: string): AdminDisputePriority {
  if (!priority) return 'medium';

  const lowerPriority = priority.toLowerCase();
  if (lowerPriority === 'low') return 'low';
  if (lowerPriority === 'medium') return 'medium';
  if (lowerPriority === 'high') return 'high';
  if (lowerPriority === 'urgent' || lowerPriority === 'critical') return 'urgent';

  return 'medium';
}

function normalizeDispute(item: RawDisputeListItem): AdminDisputeListItem {
  return {
    id: item.id ?? item.disputeId ?? '',
    bookingId: item.bookingId ?? '',
    sessionId: item.sessionId ?? null,
    studentId: item.studentId ?? item.student?.userId ?? '',
    studentName: item.student?.name ?? item.studentName ?? '-',
    studentEmail: item.student?.email ?? item.studentEmail ?? '-',
    tutorId: item.tutorId ?? item.tutor?.tutorProfileId ?? '',
    tutorName: item.tutor?.name ?? item.tutorName ?? '-',
    tutorEmail: item.tutor?.email ?? item.tutorEmail ?? '-',
    subject: item.subject ?? '-',
    description: item.description ?? '-',
    status: normalizeDisputeStatus(item.status),
    priority: normalizeDisputePriority(item.priority),
    resolution: item.resolution ?? null,
    createdAt: item.createdAt ?? new Date(0).toISOString(),
    resolvedAt: item.resolvedAt ?? null,
    updatedAt: item.updatedAt ?? null,
  };
}

function normalizeDisputesResponse(response: RawDisputeListResponse, page: number, limit: number): AdminDisputeListResponse {
  const items = (response.items ?? response.data ?? []).map(normalizeDispute);
  const total = response.pagination?.total ?? response.total ?? 0;
  const offset = (page - 1) * limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    page,
    limit,
    offset,
    totalPages,
  };
}

export const adminDisputesService = {
  async listDisputes(
    params: AdminDisputeListQueryParams
  ): Promise<AdminDisputeListResponse> {
    const { keyword, status, priority, page = 1, limit = 10 } = params;

    const response = await adminApi.get<RawDisputeListResponse>(
      '/admin/disputes',
      {
        params: {
          limit,
          offset: (page - 1) * limit,
          ...(keyword && { keyword }),
          ...(status && { status }),
          ...(priority && { priority }),
        },
      }
    );

    return normalizeDisputesResponse(response, page, limit);
  },
};
