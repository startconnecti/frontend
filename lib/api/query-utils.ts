import { toast } from 'sonner';
import { ApiError } from './errors';

/**
 * Extracts error message from any error, specifically handling ApiError
 */
export function getErrorMessage(error: any): string {
  if (ApiError.isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Standardized mutation error handler
 */
export function handleMutationError(error: any, title = 'Operation failed') {
  const message = getErrorMessage(error);
  toast.error(title, {
    description: message,
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[MutationError] ${title}:`, error);
  }
}

/**
 * Helper to handle field-level errors from ApiError (for use with React Hook Form)
 */
export function setFormErrors(error: any, setError: (name: any, error: any) => void) {
  if (ApiError.isApiError(error) && error.fieldErrors) {
    Object.entries(error.fieldErrors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      setError(field as any, {
        type: 'server',
        message: message as string,
      });
    });
  }
}
