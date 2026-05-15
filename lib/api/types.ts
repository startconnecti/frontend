export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[] | string>;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export type AnyApiResponse<T = unknown> = ApiResponse<T> | ApiErrorResponse;

export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
