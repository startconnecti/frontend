export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface TutorCertificate {
  id: string;
  title: string;
  organization: string;
  year: number;
}

export interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber: string;
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
  certificates: TutorCertificate[];
  approvalStatus: ApprovalStatus;
  isPublic: boolean;
  approvedAt?: string;
  reviewNote?: string;
}

export interface UpdateTutorProfileRequest {
  fullName: string;
  phoneNumber: string;
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
}
