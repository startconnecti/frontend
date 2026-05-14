import { api } from '@/lib/api/client';
import { TutorProfile, UpdateTutorProfileRequest } from '../types';

function normalizeTutorProfile(profile: any): TutorProfile {
  if (!profile) return profile;
  return {
    ...profile,
    fullName: profile.fullName ?? profile.name ?? '-',
    avatarUrl: profile.avatarUrl ?? profile.avatar ?? undefined,
    phoneNumber: profile.phoneNumber ?? profile.phone ?? '-',
    subjects: Array.isArray(profile.subjects) ? profile.subjects : [],
    certificates: Array.isArray(profile.certificates) ? profile.certificates : [],
    hourlyRate: Number(profile.hourlyRate) || 0,
    yearsOfExperience: Number(profile.yearsOfExperience) || 0,
  };
}

export const tutorProfileService = {
  async getTutorProfile(): Promise<TutorProfile> {
    const response = await api.get<TutorProfile>('/api/v1/tutors/profile');
    return normalizeTutorProfile(response);
  },

  async updateTutorProfile(request: UpdateTutorProfileRequest): Promise<TutorProfile> {
    const response = await api.put<TutorProfile>('/api/v1/tutors/profile', request);
    return normalizeTutorProfile(response);
  }
};
