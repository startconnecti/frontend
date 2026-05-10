export type UserRole = 'student' | 'tutor' | 'admin';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: any;
  session: AuthSession;
}
