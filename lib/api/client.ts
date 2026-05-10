import { useAuthStore } from '@/stores/auth-store';
import { ApiResponse, ApiErrorResponse } from './types';
import { ApiError } from './errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token: providedToken, headers: customHeaders, ...restOptions } = options;

  // Get token from store if not provided
  const token = providedToken || useAuthStore.getState().accessToken;

  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  // Set default headers
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().logout();
        // We don't redirect here to avoid breaking SSR or non-browser contexts, 
        // the RouteGuard will handle the redirection on the next render.
      }

      if (data.success === false) {
        throw ApiError.fromResponse(data as ApiErrorResponse, response.status);
      }
      throw new ApiError(
        {
          code: 'Internal.ServerError',
          message: data.message || 'An unexpected error occurred',
        },
        response.status
      );
    }

    // Success response should always be ApiResponse<T>
    return (data as ApiResponse<T>).data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other fetch failures
    throw new ApiError(
      {
        code: 'Network.Error',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
      0
    );
  }
}

/**
 * Convenience methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  
  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
