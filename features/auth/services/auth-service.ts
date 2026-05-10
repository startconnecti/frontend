import { api } from '@/lib/api/client';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterCredentialsRequest,
  VerifyRegisterOtpRequest,
  ForgotPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  ResetPasswordRequest
} from '../types';

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/v1/auth/login', request);
  },

  async registerCredentials(request: RegisterCredentialsRequest): Promise<boolean> {
    await api.post('/api/v1/auth/register', request);
    return true;
  },

  async verifyRegisterOtp(request: VerifyRegisterOtpRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/v1/auth/register/verify-otp', request);
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
