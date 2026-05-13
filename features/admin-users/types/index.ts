export type AdminUserRole = 'student' | 'tutor';

export type AdminUserStatus = 'active' | 'inactive' | 'blocked';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  lastLoginAt?: string | null;
}

export interface AdminUsersQueryParams {
  keyword?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
  page?: number;
  limit?: number;
}

export interface AdminUsersListResponse {
  items: AdminUser[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export type AdminUserDetail = AdminUser & {
  phone?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  tutorProfileSummary?: AdminUserTutorProfileSummary | null;
};

export interface AdminUserTutorProfileSummary {
  id?: string;
  tutorProfileId?: string;
  profileStatus?: string;
  approvalStatus?: string;
  hourlyRate?: number;
  subjects?: Array<{ id: string; name: string }>;
  bio?: string;
  experienceText?: string;
  approvalNote?: string | null;
  certifications?: Array<{
    id?: string;
    name?: string;
    issuer?: string;
    url?: string;
    uploadedAt?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserMutationResponse {
  message: string;
}