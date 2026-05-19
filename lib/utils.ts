import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const domain = apiBase.replace(/\/api\/v1\/?$/, ''); 
  
  return `${domain}${path.startsWith('/') ? '' : '/'}${path}`;
}
