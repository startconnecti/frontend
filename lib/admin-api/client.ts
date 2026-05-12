import { useAdminAuthStore, type AdminAuthUser } from '@/stores/admin-auth-store';
import { AdminApiError } from './errors';
import { AdminApiErrorResponse, AdminApiSuccessResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

type AdminRequestBody =
  | object
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

interface AdminRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
  _isRetry?: boolean;
}

function buildAdminApiUrl(endpoint: string, params?: AdminRequestOptions['params']) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!API_BASE_URL) {
    throw new AdminApiError(
      {
        code: 'Config.MissingApiBaseUrl',
        message: 'API base URL is not configured',
      },
      0
    );
  }

  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url;
}

async function parseAdminResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new AdminApiError(
      {
        code: 'AdminApi.MalformedResponse',
        message: 'The server returned an invalid response',
      },
      response.status
    );
  }
}

function isAdminApiErrorResponse(data: unknown): data is AdminApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as { success: unknown }).success === false &&
    'error' in data
  );
}

function isAdminApiSuccessResponse<T>(
  data: unknown
): data is AdminApiSuccessResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as { success: unknown }).success === true &&
    'data' in data
  );
}

function createAdminFallbackError(data: unknown, status: number): AdminApiError {
  const message =
    typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
      ? (data as { message: string }).message
      : 'An unexpected error occurred';

  return new AdminApiError(
    {
      code: status === 404 ? 'Resource.NotFound' : 'Internal.ServerError',
      message,
    },
    status
  );
}

function serializeAdminBody(body: AdminRequestBody | undefined): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}

let refreshPromise: Promise<void> | null = null;

const AUTH_ENDPOINTS = [
  '/api/v1/admin/auth/login',
  '/api/v1/admin/auth/refresh',
  '/api/v1/admin/auth/logout',
];

interface RefreshResponseData {
  accessToken?: string;
  refreshToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken?: string;
  };
  admin?: unknown;
}

export async function adminRequest<T>(
  endpoint: string,
  options: AdminRequestOptions = {}
): Promise<T> {
  const { params, token: providedToken, headers: customHeaders, _isRetry, ...restOptions } = options;
  const authStore = useAdminAuthStore.getState();
  const token = providedToken ?? authStore.accessToken;
  const url = buildAdminApiUrl(endpoint, params);

  const headers = new Headers(customHeaders);
  headers.set('Accept', 'application/json');

  if (restOptions.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
    });

    const data = await parseAdminResponseBody(response);

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        const isAuthEndpoint = AUTH_ENDPOINTS.some(path => endpoint.includes(path));
        
        if (isAuthEndpoint || _isRetry) {
          authStore.logout();
          if (isAdminApiErrorResponse(data)) {
            throw AdminApiError.fromResponse(data, response.status);
          }
          throw createAdminFallbackError(data, response.status);
        }

        // Handle concurrent refresh
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const refreshToken = useAdminAuthStore.getState().refreshToken;
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }

              // Use fetch directly to avoid recursion
              const refreshUrl = buildAdminApiUrl('/api/v1/admin/auth/refresh');
              const refreshResponse = await fetch(refreshUrl.toString(), {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
              });

              if (!refreshResponse.ok) {
                throw new Error('Refresh token request failed');
              }

              const refreshData = await parseAdminResponseBody(refreshResponse);
              
              // Handle flexibile response shapes
              let unwrappedData = refreshData as RefreshResponseData;
              if (isAdminApiSuccessResponse<RefreshResponseData>(refreshData)) {
                unwrappedData = refreshData.data;
              }

              const newAccessToken = unwrappedData.tokens?.accessToken ?? unwrappedData.accessToken;
              const newRefreshToken = unwrappedData.tokens?.refreshToken ?? unwrappedData.refreshToken;
              const adminData = unwrappedData.admin;

              if (!newAccessToken) {
                throw new Error('New access token not found in refresh response');
              }

              useAdminAuthStore.getState().setSession(
                newAccessToken,
                newRefreshToken,
                adminData as AdminAuthUser
              );
            } catch (error) {
              useAdminAuthStore.getState().logout();
              throw error;
            } finally {
              refreshPromise = null;
            }
          })();
        }

        // Wait for refresh to complete (either this request or another one)
        try {
          await refreshPromise;
        } catch (error) {
          // Refresh failed, error already handled by logout in the promise
          if (isAdminApiErrorResponse(data)) {
            throw AdminApiError.fromResponse(data, response.status);
          }
          throw createAdminFallbackError(data, response.status);
        }

        // Retry the original request
        return adminRequest<T>(endpoint, {
          ...options,
          _isRetry: true,
        });
      }

      if (isAdminApiErrorResponse(data)) {
        throw AdminApiError.fromResponse(data, response.status);
      }

      throw createAdminFallbackError(data, response.status);
    }

    if (isAdminApiSuccessResponse<T>(data)) {
      return data.data;
    }

    return data as T;
  } catch (error) {
    if (AdminApiError.isAdminApiError(error)) {
      throw error;
    }

    throw new AdminApiError(
      {
        code: 'Network.Error',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
      0
    );
  }
}

export const adminApi = {
  get: <T>(endpoint: string, options?: AdminRequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T, TBody extends AdminRequestBody = AdminRequestBody>(
    endpoint: string,
    body?: TBody,
    options?: AdminRequestOptions
  ) =>
    adminRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: serializeAdminBody(body),
    }),

  put: <T, TBody extends AdminRequestBody = AdminRequestBody>(
    endpoint: string,
    body?: TBody,
    options?: AdminRequestOptions
  ) =>
    adminRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: serializeAdminBody(body),
    }),

  patch: <T, TBody extends AdminRequestBody = AdminRequestBody>(
    endpoint: string,
    body?: TBody,
    options?: AdminRequestOptions
  ) =>
    adminRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: serializeAdminBody(body),
    }),

  delete: <T>(endpoint: string, options?: AdminRequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};