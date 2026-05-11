import { AdminApiErrorResponse } from './types';

export class AdminApiError extends Error {
  code: string;
  fieldErrors?: Record<string, string[] | string>;
  status: number;
  requestId?: string;

  constructor(
    errorResponse: AdminApiErrorResponse['error'],
    status: number,
    requestId?: string
  ) {
    super(errorResponse.message);
    this.name = 'AdminApiError';
    this.code = errorResponse.code;
    this.fieldErrors = errorResponse.fieldErrors;
    this.status = status;
    this.requestId = requestId;
  }

  static fromResponse(response: AdminApiErrorResponse, status: number): AdminApiError {
    return new AdminApiError(response.error, status, response.meta.requestId);
  }

  static isAdminApiError(error: unknown): error is AdminApiError {
    return error instanceof AdminApiError;
  }
}