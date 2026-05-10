import { api } from '@/lib/api/client';
import { ProfileSettings, UpdateProfileRequest, ChangePasswordRequest } from '../types';

export const settingsService = {
  async getProfileSettings(): Promise<ProfileSettings> {
    return api.get<ProfileSettings>('/api/v1/users/profile');
  },

  async updateProfileSettings(request: UpdateProfileRequest): Promise<ProfileSettings> {
    return api.put<ProfileSettings>('/api/v1/users/profile', request);
  },

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.put('/api/v1/users/password', request);
  }
};
