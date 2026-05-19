import { api } from '@/lib/api/client';
import { TutorProfile, UpdateTutorProfileRequest } from '../types';

function normalizeTutorProfile(profile: any): TutorProfile {
  if (!profile) return profile;
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
  };
}

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    const response = await api.get<any>('/api/v1/tutor/profile');
    return normalizeTutorProfile(response);
  },

  async updateTutorProfile(request: any): Promise<TutorProfile> {
    const payload = {
      bio: request.bio,
      experience_text: request.experienceText,
      hourly_rate: Number(request.hourlyRate),
      subject_ids: Array.isArray(request.subjects)
        ? request.subjects.map((s: any) => typeof s === 'string' ? s : s.id || s)
        : [],
    };
    const response = await api.put<any>('/api/v1/tutor/profile', payload);
    return normalizeTutorProfile(response);
  }
};
