export type AdminAccountStatus = 'active' | 'inactive' | 'suspended';
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export interface AdminAccountListItem {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  status: AdminAccountStatus;
  createdAt: string;
}

export interface AdminAccountsListResponse {
  items: AdminAccountListItem[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
  page: number;
  totalPages: number;
}

export interface AdminAccountsQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
}
