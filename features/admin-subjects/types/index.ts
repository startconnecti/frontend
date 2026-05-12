export type AdminSubjectStatus = 'active' | 'inactive';

export interface AdminSubjectListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: AdminSubjectStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminSubjectsListResponse {
  items: AdminSubjectListItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  page: number;
  totalPages: number;
}

export interface AdminSubjectsQueryParams {
  keyword?: string;
  status?: AdminSubjectStatus;
  page?: number;
  limit?: number;
}
