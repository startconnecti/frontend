export const AUTH_CONSTANTS = {
  MOCK_OTP: '123456',
  MIN_PASSWORD_LENGTH: 8,
  SESSION_TOKEN: 'connecti_session_v1',
};

export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_QUERY_KEYS.all, 'user'] as const,
};
