import { adminApi } from '@/lib/admin-api/client';
import { AdminLoginRequest, AdminLoginResponse } from '../types';

export const adminAuthService = {
  login(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    return adminApi.post<AdminLoginResponse, AdminLoginRequest>(
      '/api/v1/admin/auth/login',
      payload
    );
  },
};