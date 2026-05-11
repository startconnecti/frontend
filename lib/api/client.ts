import { useAuthStore } from '@/stores/auth-store';
import { ApiError } from './errors';
import { ApiErrorResponse, ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

type RequestBody = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
}

function buildApiUrl(endpoint: string, params?: RequestOptions['params']) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!API_BASE_URL) {
    throw new ApiError(
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

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(
      {
        code: 'Api.MalformedResponse',
        message: 'The server returned an invalid response',
      },
      response.status
    );
  }
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as { success: unknown }).success === false &&
    'error' in data
  );
}

function isApiSuccessResponse<T>(data: unknown): data is ApiResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as { success: unknown }).success === true &&
    'data' in data
  );
}

function createFallbackApiError(data: unknown, status: number): ApiError {
  const message =
    typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
      ? (data as { message: string }).message
      : 'An unexpected error occurred';

  return new ApiError(
    {
      code: status === 404 ? 'Resource.NotFound' : 'Internal.ServerError',
      message,
    },
    status
  );
}

function serializeBody(body: RequestBody | undefined): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token: providedToken, headers: customHeaders, ...restOptions } = options;
  const token = providedToken ?? useAuthStore.getState().accessToken;
  const url = buildApiUrl(endpoint, params);

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

    const data = await parseResponseBody(response);

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
      }

      if (isApiErrorResponse(data)) {
        throw ApiError.fromResponse(data, response.status);
      }

      throw createFallbackApiError(data, response.status);
    }

    if (isApiSuccessResponse<T>(data)) {
      return data.data;
    }

    return data as T;
  } catch (error) {
    if (ApiError.isApiError(error)) {
      throw error;
    }

    throw new ApiError(
      {
        code: 'Network.Error',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
      0
    );
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T, TBody extends RequestBody = RequestBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: serializeBody(body),
    }),

  put: <T, TBody extends RequestBody = RequestBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: serializeBody(body),
    }),

  patch: <T, TBody extends RequestBody = RequestBody>(
    endpoint: string,
    body?: TBody,
    options?: RequestOptions
  ) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: serializeBody(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};