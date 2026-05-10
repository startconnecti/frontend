import { ApiError } from '@/lib/api/errors';

export type UserRole = 'student' | 'tutor';
export type UserStatus = 'active' | 'inactive' | 'blocked';
export type Gender = 'male' | 'female' | 'other' | 'undisclosed';
export type TutorApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  approvalStatus?: TutorApprovalStatus;
  onboardingCompleted: boolean;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: string;
}

export interface LoginRequest {
  email: string;
  password?: string; // Optional if using OTP login, but required for credentials mock
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterCredentialsRequest {
  email: string;
  password?: string;
  role: UserRole;
}

export interface VerifyRegisterOtpRequest {
  email: string;
  otp: string;
  role: UserRole;
}

export interface StudentProfileSetupRequest {
  fullName: string;
  phoneNumber: string;
  gender: Gender;
}

export interface TutorProfileSetupRequest extends StudentProfileSetupRequest {
  bio: string;
  subjects: string[];
  hourlyRate: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyForgotPasswordOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password?: string;
}

export type { ApiError as AuthError };
