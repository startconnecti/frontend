import { AdminAuthUser } from '@/stores/admin-auth-store';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: AdminAuthUser;
  accessToken: string;
  refreshToken: string;
}