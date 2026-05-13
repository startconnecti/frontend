import type { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { AdminApiError } from './errors';

/**
 * Centralised error handler for admin API mutation calls inside forms.
 *
 * Behaviour:
 *   1. Always shows a toast with the error title + backend message.
 *   2. If `fieldErrors` exist → calls `form.setError` for each field so the
 *      message appears inline under the relevant input.
 *   3. If there are NO `fieldErrors` (business/global error) → calls
 *      `form.setError('root', ...)` so the form can surface a top-level
 *      inline alert near the submit button.
 *   4. For non-API errors (network failures, etc.) → toast only.
 *
 * Usage:
 *   try {
 *     await mutation.mutateAsync(values);
 *   } catch (error) {
 *     handleAdminFormError(error, form, 'Failed to create subject');
 *   }
 */
export function handleAdminFormError<TFieldValues extends FieldValues>(
  error: unknown,
  form: UseFormReturn<TFieldValues>,
  fallbackTitle: string,
): void {
  if (AdminApiError.isAdminApiError(error)) {
    const backendMessage = error.message || 'An unexpected error occurred.';
    const hasFieldErrors =
      error.fieldErrors != null && Object.keys(error.fieldErrors).length > 0;

    if (hasFieldErrors && error.fieldErrors) {
      // Map each field error onto the matching form field
      for (const [field, messages] of Object.entries(error.fieldErrors)) {
        const message = Array.isArray(messages) ? messages[0] : messages;
        if (message) {
          form.setError(field as FieldPath<TFieldValues>, {
            type: 'server',
            message,
          });
        }
      }

      toast.error(fallbackTitle, {
        description: 'Please fix the highlighted fields and try again.',
      });
    } else {
      // Business / global error — no specific field to attach the error to.
      // Set a root-level form error so the form itself can render it inline.
      form.setError('root' as FieldPath<TFieldValues>, {
        type: 'server',
        message: backendMessage,
      });

      toast.error(fallbackTitle, { description: backendMessage });
    }
  } else {
    // Network / unexpected JS error
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    toast.error(fallbackTitle, { description: message });
  }
}
