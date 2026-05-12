export type PermissionGroup = 'users' | 'tutors' | 'bookings' | 'sessions' | 'payments' | 'refunds' | 'disputes' | 'subjects' | 'admins';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject';

export interface RolePermissions {
  [key: string]: PermissionAction[];
}

export interface AdminRoleItem {
  id: string;
  name: string;
  description: string;
  permissions: RolePermissions;
  createdAt: string;
}

export interface AdminRolesListResponse {
  items: AdminRoleItem[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface AdminRolesQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
}
