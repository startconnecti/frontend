import { ApiErrorResponse } from './types';

export class ApiError extends Error {
  code: string;
  fieldErrors?: Record<string, string[] | string>;
  status: number;
  requestId?: string;

  constructor(errorResponse: ApiErrorResponse['error'], status: number, requestId?: string) {
    super(errorResponse.message);
    this.name = 'ApiError';
    this.code = errorResponse.code;
    this.fieldErrors = errorResponse.fieldErrors;
    this.status = status;
    this.requestId = requestId;
  }

  static fromResponse(response: ApiErrorResponse, status: number): ApiError {
    return new ApiError(response.error, status, response.meta.requestId);
  }

  static isApiError(error: any): error is ApiError {
    return error instanceof ApiError;
  }
}

/**
 * Common API Error Codes (matched with backend)
 */
export const ApiErrorCodes = {
  VALIDATION_FAILED: 'Validation.Failed',
  INVALID_CREDENTIALS: 'Auth.InvalidCredentials',
  TOKEN_EXPIRED: 'Auth.TokenExpired',
  INVALID_TOKEN: 'Auth.InvalidToken',
  FORBIDDEN: 'Common.Forbidden',
  INTERNAL_SERVER_ERROR: 'Internal.ServerError',
} as const;
