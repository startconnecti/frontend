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
  ONBOARDING_STUDENT: '/onboarding/student',
  ONBOARDING_TUTOR: '/onboarding/tutor',

  // Redirect Helpers
  STUDENT_DASHBOARD: '/student/dashboard',
  TUTOR_DASHBOARD: '/tutor/dashboard',

  // Shared Logged-in
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_PASSWORD: '/settings/password',

  // Student Dashboard
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    BOOKINGS: '/student/bookings',
    SESSIONS: '/student/sessions',
    SESSION_DETAIL: (id: string) => `/student/sessions/${id}`,
    SESSION_FEEDBACK: (id: string) => `/student/sessions/${id}/feedback`,
    PAYMENTS: '/student/payments',
    PAYMENT_DETAIL: (id: string) => `/student/payments/${id}`,
    FAVORITES: '/student/favorites',
    FEEDBACKS: '/student/feedbacks',
  },

  // Tutor Dashboard
  TUTOR: {
    DASHBOARD: '/tutor/dashboard',
    PROFILE: '/tutor/profile',
    AVAILABILITY: '/tutor/availability',
    BOOKINGS: '/tutor/bookings',
    SESSIONS: '/tutor/sessions',
    SESSION_DETAIL: (id: string) => `/tutor/sessions/${id}`,
    REVIEWS: '/tutor/reviews',
    INCOME: '/tutor/income',
    PAYOUTS: '/tutor/payouts',
  },
} as const;
