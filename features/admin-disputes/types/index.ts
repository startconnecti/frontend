export type AdminDisputeStatus =
  | 'open'
  | 'pending'
  | 'reviewing'
  | 'resolved'
  | 'rejected'
  | 'closed';

export interface AdminDisputeListItem {
  id: string;
  disputeCode: string;
  studentId: string;
  studentName: string;
  tutorProfileId: string;
  tutorName: string;
  sessionId: string | null;
  status: AdminDisputeStatus;
  createdAt: string;
}

export interface AdminDisputeDetail {
  id: string;
  disputeCode: string;
  studentId: string | null;
  studentName: string | null;
  tutorProfileId: string | null;
  tutorName: string | null;
  sessionId: string | null;
  reason: string | null;
  status: AdminDisputeStatus;
  resolutionType: string | null;
  resolutionNote: string | null;
  refundAmount: number | null;
  rejectReason: string | null;
  closeNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDisputeDetailResponse {
  dispute: AdminDisputeDetail;
}

export interface AdminDisputeListResponse {
  items: AdminDisputeListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminDisputeListQueryParams {
  keyword?: string;
  status?: AdminDisputeStatus;
  page?: number;
  limit?: number;
}
