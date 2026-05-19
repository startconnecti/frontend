import { api } from '@/lib/api/client';
import { ProfileSettings, UpdateProfileRequest, ChangePasswordRequest } from '../types';

export const settingsService = {
  async getProfileSettings(): Promise<ProfileSettings> {
    const response = await api.get<any>('/api/v1/me/profile');
    return {
      fullName: response.fullName ?? '',
      email: response.email ?? '',
      phoneNumber: response.phoneNumber ?? '',
      dateOfBirth: response.dob ?? '',
      gender: response.gender as any,
      avatarUrl: response.avatarUrl,
      role: response.role as any,
    };
  },

  async updateProfileSettings(request: UpdateProfileRequest): Promise<ProfileSettings> {
    const payload = {
      full_name: request.fullName,
      phone: request.phoneNumber,
      dob: request.dateOfBirth,
      gender: request.gender,
    };
    const response = await api.put<{ message: string; user: any }>('/api/v1/me/profile', payload);
    const u = response.user;
    return {
      fullName: u.fullName ?? '',
      email: u.email ?? '',
      phoneNumber: u.phone ?? '',
      dateOfBirth: u.dob ?? '',
      gender: u.gender as any,
      avatarUrl: u.avatarUrl,
      role: u.role as any,
    };
  },

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.post('/api/v1/me/change-password', {
      current_password: request.currentPassword,
      new_password: request.newPassword,
      confirm_password: request.confirmPassword,
    });
  },

  async getStudentProfile(): Promise<{ userId: string; subjectIds: string[] }> {
    return api.get<{ userId: string; subjectIds: string[] }>('/api/v1/me/student-profile');
  },

  async updateStudentProfile(subjectIds: string[]): Promise<{ message: string; subjectIds: string[] }> {
    return api.put<{ message: string; subjectIds: string[] }>('/api/v1/me/student-profile', { subjectIds });
  },

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ avatarUrl: string }>('/api/v1/me/avatar', formData);
  }
};
