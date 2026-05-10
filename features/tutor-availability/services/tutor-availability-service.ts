import { TutorAvailability, UpdateAvailabilityRequest } from '../types';
import { MOCK_TUTOR_AVAILABILITY } from '../mock-data';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let availabilityStorage = { ...MOCK_TUTOR_AVAILABILITY };

export const tutorAvailabilityService = {
  async getTutorAvailability(): Promise<TutorAvailability> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    return { ...availabilityStorage };
  },

  async updateTutorAvailability(request: UpdateAvailabilityRequest): Promise<TutorAvailability> {
    const latency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    await sleep(latency);
    availabilityStorage = { ...availabilityStorage, slots: request.slots };
    return { ...availabilityStorage };
  }
};
