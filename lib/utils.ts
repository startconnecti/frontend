import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PLATFORM_CURRENCY } from './constants/currency'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency?: string | null): string {
  const safeAmount = amount ?? 0;
  // Always enforce VND format for now, ignoring the passed currency param 
  // since the platform is officially single-currency (VND).
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: PLATFORM_CURRENCY,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}
