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

export interface TutorOnboardingCertificate {
  title: string;
  issuer: string;
  issuedAt: string;
  fileName?: string;
}

export interface TutorOnboardingAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface TutorOnboardingRequest {
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender: Gender;
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
  certificates: TutorOnboardingCertificate[];
  weeklyAvailability: TutorOnboardingAvailability[];
  requestNote?: string;
}

export interface TutorOnboardingResponse {
  success: boolean;
  message: string;
  approvalStatus: 'pending';
}
