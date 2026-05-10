import { Gender } from './types';

export const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'undisclosed' },
];

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Spanish',
  'French',
  'Computer Science',
  'History',
  'Geography',
  'Art',
  'Music',
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ONBOARDING_CONSTANTS = {
  LEARNING_GOAL_MAX_LENGTH: 500,
  BIO_MIN_LENGTH: 50,
  MOCK_LATENCY: {
    MIN: 300,
    MAX: 600,
  },
};
