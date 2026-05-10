import { TutorProfile } from './types';

export const MOCK_TUTOR_PROFILE: TutorProfile = {
  id: 'tutor-001',
  userId: 'user-001',
  fullName: 'Dr. Sarah Wilson',
  avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
  phoneNumber: '+84 901 234 567',
  bio: 'PhD in Physics with 10+ years of teaching experience. I specialize in making complex concepts easy to understand.',
  experienceText: 'I have taught physics at both high school and college levels. My approach focuses on practical applications and problem-solving techniques.',
  yearsOfExperience: 12,
  hourlyRate: 60,
  subjects: ['Physics', 'Mathematics', 'Astronomy'],
  certificates: [
    {
      id: 'cert-001',
      title: 'PhD in Theoretical Physics',
      organization: 'MIT',
      year: 2012,
    }
  ],
  approvalStatus: 'approved',
  isPublic: true,
  approvedAt: '2024-01-15T00:00:00Z',
};
