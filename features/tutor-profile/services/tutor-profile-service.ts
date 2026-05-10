import { TutorProfile, UpdateTutorProfileRequest } from '../types';
import { MOCK_TUTOR_PROFILE } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let profileStorage = { ...MOCK_TUTOR_PROFILE };

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return { ...profileStorage };
  },

  async updateTutorProfile(request: UpdateTutorProfileRequest): Promise<TutorProfile> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    
    // If approved, we simulate a "change request" by updating the status back to pending 
    // for certain critical fields, but for this mock foundation we just update the data.
    profileStorage = { ...profileStorage, ...request };
    
    return { ...profileStorage };
  }
};
