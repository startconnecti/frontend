export interface ProfileSettings {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  avatarUrl?: string;
  role: 'student' | 'tutor';
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
