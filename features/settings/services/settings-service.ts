import { ProfileSettings, UpdateProfileRequest, ChangePasswordRequest } from '../types';
import { MOCK_PROFILE_SETTINGS } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let profileStorage = { ...MOCK_PROFILE_SETTINGS };

export const settingsService = {
  async getProfileSettings(): Promise<ProfileSettings> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return { ...profileStorage };
  },

  async updateProfileSettings(request: UpdateProfileRequest): Promise<ProfileSettings> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    profileStorage = { ...profileStorage, ...request };
    return { ...profileStorage };
  },

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    // Simulating success
  }
};
