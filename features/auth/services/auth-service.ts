import { 
  AuthUser, 
  LoginRequest, 
  LoginResponse, 
  AuthError,
  RegisterCredentialsRequest,
  VerifyRegisterOtpRequest,
  ForgotPasswordRequest,
  VerifyForgotPasswordOtpRequest,
  ResetPasswordRequest
} from '../types';
import { MOCK_USERS } from '../mock-users';
import { AUTH_CONSTANTS } from '../constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    await delay(Math.floor(Math.random() * (600 - 300 + 1) + 300));

    const user = MOCK_USERS.find(u => u.email === request.email);

    if (!user || user.password !== request.password) {
      throw { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' } as AuthError;
    }

    if (user.status === 'blocked') {
      throw { message: 'Your account has been blocked. Please contact support.', code: 'USER_BLOCKED' } as AuthError;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token: `mock-jwt-token-${user.id}-${Date.now()}`
    };
  },

  async registerCredentials(request: RegisterCredentialsRequest): Promise<boolean> {
    await delay(500);
    const exists = MOCK_USERS.some(u => u.email === request.email);
    if (exists) {
      throw { message: 'Email already in use', code: 'EMAIL_EXISTS' } as AuthError;
    }
    // Mock OTP sent to email
    return true;
  },

  async verifyRegisterOtp(request: VerifyRegisterOtpRequest & { role: UserRole }): Promise<LoginResponse> {
    await delay(400);
    if (request.otp !== AUTH_CONSTANTS.MOCK_OTP) {
      throw { message: 'Invalid verification code', code: 'INVALID_OTP' } as AuthError;
    }
    
    return {
      user: {
        id: `user_new_${Date.now()}`,
        email: request.email,
        fullName: request.email.split('@')[0],
        role: request.role,
        status: 'active',
        onboardingCompleted: false,
      },
      token: `mock-jwt-token-new-${Date.now()}`
    };
  },

  async requestForgotPassword(request: ForgotPasswordRequest): Promise<boolean> {
    await delay(300);
    const exists = MOCK_USERS.some(u => u.email === request.email);
    if (!exists) {
      throw { message: 'No account found with this email', code: 'USER_NOT_FOUND' } as AuthError;
    }
    // Mock Reset OTP sent to email
    return true;
  },

  async verifyForgotPasswordOtp(request: VerifyForgotPasswordOtpRequest): Promise<boolean> {
    await delay(300);
    if (request.otp !== AUTH_CONSTANTS.MOCK_OTP) {
      throw { message: 'Invalid verification code', code: 'INVALID_OTP' } as AuthError;
    }
    return true;
  },

  async resetPassword(request: ResetPasswordRequest): Promise<boolean> {
    await delay(500);
    if (request.otp !== AUTH_CONSTANTS.MOCK_OTP) {
      throw { message: 'Session expired or invalid code', code: 'INVALID_OTP' } as AuthError;
    }
    return true;
  }
};
