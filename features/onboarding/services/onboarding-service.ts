import { StudentOnboardingRequest, StudentOnboardingResponse, TutorOnboardingRequest, TutorOnboardingResponse } from '../types';
import { ONBOARDING_CONSTANTS } from '../constants';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const onboardingService = {
  async completeStudentOnboarding(request: StudentOnboardingRequest): Promise<StudentOnboardingResponse> {
    const latency = Math.floor(
      Math.random() * (ONBOARDING_CONSTANTS.MOCK_LATENCY.MAX - ONBOARDING_CONSTANTS.MOCK_LATENCY.MIN + 1)
    ) + ONBOARDING_CONSTANTS.MOCK_LATENCY.MIN;

    await sleep(latency);

    return {
      success: true,
      message: 'Student profile successfully completed.',
    };
  },

  async completeTutorOnboarding(request: TutorOnboardingRequest): Promise<TutorOnboardingResponse> {
    const latency = Math.floor(
      Math.random() * (ONBOARDING_CONSTANTS.MOCK_LATENCY.MAX - ONBOARDING_CONSTANTS.MOCK_LATENCY.MIN + 1)
    ) + ONBOARDING_CONSTANTS.MOCK_LATENCY.MIN;

    await sleep(latency);

    return {
      success: true,
      message: 'Your tutor profile has been submitted for admin review.',
      approvalStatus: 'pending',
    };
  },
};
