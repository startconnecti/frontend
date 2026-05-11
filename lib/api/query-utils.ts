import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiError } from './errors';

/**
 * Extracts error message from unknown errors, specifically handling ApiError.
 */
export function getErrorMessage(error: unknown): string {
  if (ApiError.isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Standardized mutation error handler.
 */
export function handleMutationError(error: unknown, title = 'Operation failed') {
  const message = getErrorMessage(error);

  toast.error(title, {
    description: message,
  });
}

/**
 * Helper to handle field-level errors from ApiError for React Hook Form.
 */
export function setFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
) {
  if (!ApiError.isApiError(error) || !error.fieldErrors) {
    return;
  }

  Object.entries(error.fieldErrors).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;

    if (!message) {
      return;
    }

    setError(field as Path<TFieldValues>, {
      type: 'server',
      message,
    });
  });
}