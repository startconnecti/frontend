export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TutorProfileSnapshotProfile {
  bio: string;
  experience_text: string;
  years_of_experience: number;
  hourly_rate: number;
}

export interface TutorProfileSnapshotCertification {
  id?: string;
  name: string;
  issuer: string;
  issuedAt: string;
  certificateUrl?: string;
  tempFileKey?: string;
  file?: File;
}

export interface TutorProfileChangePayload {
  profile: TutorProfileSnapshotProfile;
  subject_ids: string[];
  certifications: TutorProfileSnapshotCertification[];
}

export interface TutorProfileChangeRequest {
  id: string;
  tutorProfileId: string;
  status: ChangeRequestStatus;
  changePayload: TutorProfileChangePayload;
  requestNote?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorCertificate {
  id: string;
  title: string;
  organization: string;
  year: number;
  certificateUrl?: string;
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
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
}

export interface CreateTutorProfileRequest {
  bio: string;
  experienceText: string;
  yearsOfExperience: number;
  hourlyRate: number;
  subjects: string[];
}

export interface GetChangeRequestsParams {
  status?: ChangeRequestStatus;
  limit?: number;
  offset?: number;
}

export interface ChangeRequestsListResponse {
  items: TutorProfileChangeRequest[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}
