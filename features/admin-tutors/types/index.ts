export type AdminTutorProfileStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface AdminTutorSubject {
  id: string;
  name: string;
}

export interface AdminTutorListItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  profileStatus: AdminTutorProfileStatus;
  hourlyRate: number;
  subjects: AdminTutorSubject[];
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminTutorsQueryParams {
  keyword?: string;
  status?: AdminTutorProfileStatus;
  page?: number;
  limit?: number;
}

export interface AdminTutorsListResponse {
  items: AdminTutorListItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface AdminTutorDetail extends AdminTutorListItem {
  bio?: string | null;
  experienceText?: string | null;
  approvalNote?: string | null;
  certifications: Array<{
    id?: string;
    name?: string;
    issuer?: string;
    url?: string;
    uploadedAt?: string;
  }>;
}

export interface ApproveTutorProfileRequest {
  note?: string;
}

export interface RejectTutorProfileRequest {
  reason: string;
}

export interface SuspendTutorProfileRequest {
  reason: string;
}

export interface UnsuspendTutorProfileRequest {
  note?: string;
}

export interface TutorProfileMutationResponse {
  message: string;
}