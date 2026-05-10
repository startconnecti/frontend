export type Gender = 'male' | 'female' | 'other' | 'undisclosed';

export interface StudentOnboardingRequest {
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender: Gender;
  interestedSubjects?: string[];
  learningGoal?: string;
}

export interface StudentOnboardingResponse {
  success: boolean;
  message: string;
}
