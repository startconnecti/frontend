export type AdminTutorProfileChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface AdminTutorProfileChangeRequest {
  requestId: string;
  tutorProfileId: string;
  tutorName: string;
  status: AdminTutorProfileChangeRequestStatus;
  createdAt: string;
}

export interface AdminTutorProfileChangeRequestDetail {
  id: string;
  tutorProfileId: string;
  tutor: {
    id: string;
    fullName: string;
    email: string;
  };
  requestedByUser: {
    id: string;
    fullName: string;
    email: string;
  };
  changePayload: {
    profile?: {
      bio?: string | null;
      experience_text?: string | null;
      years_of_experience?: number | null;
      hourly_rate?: number | null;
    };
    subject_ids?: string[];
    certifications?: Array<{
      id?: string | null;
      name?: string;
      issuer?: string | null;
      issuedAt?: string | null;
      fileUrl?: string | null;
      certificateUrl?: string | null;
      url?: string | null;
    }>;
  }; // Stored as Prisma.InputJsonObject on backend, parsed locally
  status: AdminTutorProfileChangeRequestStatus;
  requestNote: string | null;
  reviewNote: string | null;
  reviewedByAdmin: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminChangeRequestsQueryParams {
  page?: number;
  limit?: number;
  status?: AdminTutorProfileChangeRequestStatus;
}

export interface AdminChangeRequestsListResponse {
  items: AdminTutorProfileChangeRequest[];
  total: number;
  page: number;
  limit: number;
  offset: number;
  totalPages: number;
}
