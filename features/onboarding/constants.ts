import { Gender } from './types';

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'undisclosed' },
];

export const ONBOARDING_CONSTANTS = {
  LEARNING_GOAL_MAX_LENGTH: 500,
  MOCK_LATENCY: {
    MIN: 300,
    MAX: 600,
  },
};
