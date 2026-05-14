import { api } from '@/lib/api/client';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterCredentialsRequest,
  VerifyRegisterOtpRequest,
  ForgotPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  ResetPasswordRequest,
  AuthUser
} from '../types';

function normalizeAuthUser(user: any): AuthUser {
  if (!user) return user;
  return {
    ...user,
    fullName: user.fullName ?? user.name ?? '-',
    avatarUrl: user.avatarUrl ?? user.avatar ?? undefined,
    phoneNumber: user.phoneNumber ?? user.phone ?? undefined,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    onboardingSkipped: Boolean(user.onboardingSkipped),
    hasProfile: user.hasProfile ?? user.hasTutorProfile ?? false,
  };
}

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', request);
    return {
      ...response,
      user: normalizeAuthUser(response.user),
    };
  },

  async registerCredentials(request: RegisterCredentialsRequest): Promise<boolean> {
    await api.post('/api/v1/auth/register', request);
    return true;
  },

  async verifyRegisterOtp(request: VerifyRegisterOtpRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/v1/auth/register/verify-otp', request);
    return {
      ...response,
      user: normalizeAuthUser(response.user),
    };
  },

  async requestForgotPassword(request: ForgotPasswordRequest): Promise<boolean> {
    await api.post('/api/v1/auth/forgot-password/request-otp', request);
    return true;
  },

  async verifyForgotPasswordOtp(request: VerifyForgotPasswordOtpRequest): Promise<boolean> {
    await api.post('/api/v1/auth/forgot-password/verify-otp', request);
    return true;
  },

  async resetPassword(request: ResetPasswordRequest): Promise<boolean> {
    await api.post('/api/v1/auth/forgot-password/reset-password', request);
    return true;
  }
};
