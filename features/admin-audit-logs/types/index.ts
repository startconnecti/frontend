export interface AdminAuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface AdminAuditLogsListResponse {
  items: AdminAuditLogItem[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
  page: number;
  totalPages: number;
}

export interface AdminAuditLogsQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
}
