export const ROUTES = {
  // Public
  HOME: '/',
  DISCOVER: '/discover',
  HOW_IT_WORKS: '/how-it-works',
  BECOME_A_TUTOR: '/register?role=tutor',
  TUTOR_DETAIL: (id: string) => `/tutors/${id}`,

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Shared Logged-in
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  SETTINGS_PROFILE: '/settings/profile',
  SESSION: (id: string) => `/sessions/${id}`,

  // Student Dashboard
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    BOOKINGS: '/student/bookings',
    SESSIONS: '/student/sessions',
    PAYMENTS: '/student/payments',
    FAVORITES: '/student/favorites',
  },

  // Tutor Dashboard
  TUTOR: {
    DASHBOARD: '/tutor/dashboard',
    PROFILE: '/tutor/profile',
    AVAILABILITY: '/tutor/availability',
    BOOKINGS: '/tutor/bookings',
    SESSIONS: '/tutor/sessions',
    REVIEWS: '/tutor/reviews',
    INCOME: '/tutor/income',
    PAYOUTS: '/tutor/payouts',
  },
} as const;
