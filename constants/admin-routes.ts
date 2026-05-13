export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  LOGIN: '/admin/login',

  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  USER_CREATE: '/admin/users/create',
  USER_EDIT: (id: string) => `/admin/users/${id}/edit`,

  TUTORS: '/admin/tutors',
  TUTOR_DETAIL: (id: string) => `/admin/tutors/${id}`,
  TUTOR_EDIT: (id: string) => `/admin/tutors/${id}/edit`,
  TUTOR_CREATE: '/admin/tutors/create',

  BOOKINGS: '/admin/bookings',
  BOOKING_DETAIL: (id: string) => `/admin/bookings/${id}`,

  SESSIONS: '/admin/sessions',
  PAYMENTS: '/admin/payments',
  REFUNDS: '/admin/refunds',
  PAYOUTS: '/admin/payouts',
  DISPUTES: '/admin/disputes',

  CONVERSATIONS: '/admin/conversations',
  CONVERSATION_DETAIL: (id: string) => `/admin/conversations/${id}`,

  NOTIFICATIONS: '/admin/notifications',
  NOTIFICATION_CREATE: '/admin/notifications/create',
  NOTIFICATION_DETAIL: (id: string) => `/admin/notifications/${id}`,
  NOTIFICATION_EDIT: (id: string) => `/admin/notifications/${id}/edit`,

  SUBJECTS: '/admin/subjects',
  SUBJECT_CREATE: '/admin/subjects/create',
  SUBJECT_EDIT: (id: string) => `/admin/subjects/${id}/edit`,

  ADMINS: '/admin/admins',
  ADMIN_CREATE: '/admin/admins/create',
  ADMIN_EDIT: (id: string) => `/admin/admins/${id}/edit`,

  ROLES: '/admin/roles',
  AUDIT_LOGS: '/admin/audit-logs',
  AUDIT_LOG_DETAIL: (id: string) => `/admin/audit-logs/${id}`,
  SYSTEM_SETTINGS: '/admin/system-settings',
} as const;