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
  onboardingSkipped?: boolean;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: string;
  hasProfile?: boolean;
  tutorProfileStatus?: string | null;
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
  role: UserRole;
  email: string;
  full_name: string;
  password?: string;
  confirm_password?: string;
  phone?: string;
  dob?: string;
  gender: Gender;
}

export interface VerifyRegisterOtpRequest {
  email: string;
  otp: string;
  role: UserRole;
}

export interface StudentProfileSetupRequest {
  interestedSubjects: string[];
  learningGoal?: string;
}

export interface TutorProfileSetupRequest {
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
  certificates: Array<{ title: string; issuer: string; year: number }>;
  weeklyAvailability: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
  requestNote?: string;
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
