export interface AdminApiMeta {
  requestId: string;
  timestamp: string;
}

export interface AdminApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: AdminApiMeta;
}

export interface AdminApiErrorBody {
  code: string;
  message: string;
  fieldErrors?: Record<string, string[] | string>;
}

export interface AdminApiErrorResponse {
  success: false;
  error: AdminApiErrorBody;
  meta: AdminApiMeta;
}