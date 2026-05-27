export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface TutorProfileSnapshotProfile {
  bio: string;
  experience_text?: string;
  experienceText?: string;
  years_of_experience?: number;
  yearsOfExperience?: number;
  hourly_rate?: number;
  hourlyRate?: number;
}

export interface TutorProfileSnapshotCertification {
  id?: string;
  name: string;
  issuer: string;
  issuedAt: string;
  /** Legacy URL field — kept for backward compat */
  certificateUrl?: string;
  /** Canonical URL from new backend schema */
  fileUrl?: string;
  tempFileKey?: string;
  file?: File;
}

export interface TutorProfileChangePayload {
  profile: TutorProfileSnapshotProfile;
  subject_ids: string[];
  subjects?: Array<{id: string; name: string}>;
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
  reviewedAt?: string;
}

export interface TutorCertificate {
  id: string;
  title: string;
  organization: string;
  year: number;
  /** Legacy field — still mapped for backward compat */
  certificateUrl?: string;
  /** Canonical document URL from new API schema */
  fileUrl?: string;
  /** Optional expiry date (ISO string or year) */
  expiryDate?: string | null;
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
