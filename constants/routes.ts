export const ROUTES = {
  HOME: '/',
  DISCOVER: '/discover',
  TUTOR_DETAIL: (id: string) => `/tutors/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  STUDENT: {
    DASHBOARD: '/student/dashboard',
  },
  TUTOR: {
    DASHBOARD: '/tutor/dashboard',
  },
} as const;
