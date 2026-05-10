export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
} as const;

export const TUTOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
