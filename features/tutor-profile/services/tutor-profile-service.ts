import { api } from '@/lib/api/client';
import { TutorCertificate, TutorProfile, UpdateTutorProfileRequest } from '../types';

/**
 * Normalizes a raw certification object from the API into a stable TutorCertificate shape.
 *
 * Supports both schemas:
 *   OLD: { name, issuer, issuedAt, certificateUrl }
 *   NEW: { certificateName, issuingOrganization, issueDate, expiryDate, fileUrl }
 */
function normalizeCertification(raw: Record<string, unknown>): TutorCertificate {
  const name =
    (raw.certificateName as string | undefined) ??
    (raw.name as string | undefined) ??
    (raw.title as string | undefined) ??
    '';

  const organization =
    (raw.issuingOrganization as string | undefined) ??
    (raw.issuer as string | undefined) ??
    (raw.organization as string | undefined) ??
    '';

  const rawDate =
    (raw.issueDate as string | undefined) ??
    (raw.issuedAt as string | undefined) ??
    '';

  // Try to extract a 4-digit year from the date string; fall back to current year
  const yearMatch = rawDate.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

  const fileUrl =
    (raw.fileUrl as string | undefined) ??
    (raw.certificateUrl as string | undefined) ??
    (raw.url as string | undefined);

  const expiryDate =
    (raw.expiryDate as string | null | undefined) ?? null;

  return {
    id: (raw.id as string | undefined) ?? '',
    title: name,
    organization,
    year,
    fileUrl,
    certificateUrl: fileUrl, // keep legacy alias populated so old consumers don't break
    expiryDate,
  };
}

function normalizeTutorProfile(profile: Record<string, unknown>): TutorProfile {
  if (!profile) return profile as unknown as TutorProfile;
  const p = (profile.tutorProfile ?? profile) as Record<string, unknown>;

  const rawCertificates = Array.isArray(p.certifications)
    ? (p.certifications as Record<string, unknown>[])
    : Array.isArray(p.certificates)
      ? (p.certificates as Record<string, unknown>[])
      : [];

  // subjects: accept [{id, name}] object array or flat string array
  const rawSubjects = Array.isArray(p.subjects) ? (p.subjects as unknown[]) : [];

  return {
    ...(p as Partial<TutorProfile>),
    fullName: (p.fullName as string | undefined) ?? (p.name as string | undefined) ?? '-',
    avatarUrl: (p.avatarUrl as string | undefined) ?? (p.avatar as string | undefined) ?? undefined,
    phoneNumber: (p.phoneNumber as string | undefined) ?? (p.phone as string | undefined) ?? '-',
    subjects: rawSubjects,
    certificates: rawCertificates.map(normalizeCertification),
    hourlyRate: Number(p.hourlyRate) || 0,
    yearsOfExperience: Number(p.yearsOfExperience) || 0,
    approvalStatus: (p.approvalStatus as TutorProfile['approvalStatus']) ?? (p.status as TutorProfile['approvalStatus']),
  };
}

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    try {
      const response = await api.get<any>('/api/v1/tutor/profile');
      return normalizeTutorProfile(response);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.status === 404 || err?.message?.includes('404')) {
        return normalizeTutorProfile({ status: 'incomplete' });
      }
      throw err;
    }
  },

  async createTutorProfile(request: Record<string, any>): Promise<TutorProfile> {
    const payload = {
      bio: request.bio,
      experience_text: request.experienceText,
      hourly_rate: Number(request.hourlyRate),
      subject_ids: Array.isArray(request.subjects)
        ? request.subjects.map((s: string | { id?: string }) => typeof s === 'string' ? s : s.id || s)
        : [],
    };
    const response = await api.post<Record<string, any>>('/api/v1/tutor/profile', payload);
    return normalizeTutorProfile(response);
  },


};
