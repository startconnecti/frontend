export type AdminUserRole = 'student' | 'tutor';

export type AdminUserStatus =
  | 'active'
  | 'inactive'
  | 'blocked';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  createdAt: string;
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
  totalPages: number;
}