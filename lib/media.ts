/**
 * Converts a relative media path into an absolute URL using the backend API base URL.
 * If the path is already an absolute URL (http:// or https://, data:, blob:), it returns it unchanged.
 * If the path is missing or empty, it returns an empty string.
 *
 * @param path The relative or absolute media path (e.g., /storage/uploads/...)
 * @returns The fully qualified absolute URL
 */
export function getMediaUrl(path?: string | null): string {
  if (!path) {
    return '';
  }

  if (
    path.startsWith('http://') || 
    path.startsWith('https://') ||
    path.startsWith('data:') || 
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Ensure path starts with a slash if concatenating
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Use NEXT_PUBLIC_API_BASE_URL if available, otherwise fallback to empty string
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  
  // Remove trailing /api/v1 if the env var includes it by mistake
  const domain = baseUrl.replace(/\/api\/v1\/?$/, '');

  return `${domain}${normalizedPath}`;
}
