import { api } from '@/lib/api/client';
import { TutorProfile, UpdateTutorProfileRequest } from '../types';

function normalizeTutorProfile(profile: Record<string, any>): TutorProfile {
  if (!profile) return profile as any;
  const p = profile.tutorProfile || profile;
  return {
    ...p,
    fullName: p.fullName ?? p.name ?? '-',
    avatarUrl: p.avatarUrl ?? p.avatar ?? undefined,
    phoneNumber: p.phoneNumber ?? p.phone ?? '-',
    subjects: Array.isArray(p.subjects) ? p.subjects : [],
    certificates: Array.isArray(p.certificates) ? p.certificates : [],
    hourlyRate: Number(p.hourlyRate) || 0,
    yearsOfExperience: Number(p.yearsOfExperience) || 0,
    approvalStatus: p.status, // Add explicit mapping
  };
}

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    const response = await api.get<any>('/api/v1/tutor/profile');
    return normalizeTutorProfile(response);
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

  async updateTutorProfile(request: Record<string, any>): Promise<TutorProfile> {
    const payload = {
      bio: request.bio,
      experience_text: request.experienceText,
      hourly_rate: Number(request.hourlyRate),
      subject_ids: Array.isArray(request.subjects)
        ? request.subjects.map((s: string | { id?: string }) => typeof s === 'string' ? s : s.id || s)
        : [],
    };
    const response = await api.put<Record<string, any>>('/api/v1/tutor/profile', payload);
    return normalizeTutorProfile(response);
  }
};
