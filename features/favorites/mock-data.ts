import { FavoriteTutor } from './types';

export const MOCK_FAVORITE_TUTORS: FavoriteTutor[] = [
  {
    favoriteId: 'fav-001',
    createdAt: '2024-05-01T10:00:00Z',
    tutor: {
      id: 'tutor-001',
      fullName: 'Dr. Sarah Wilson',
      avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
      bio: 'PhD in Physics with 10+ years of teaching experience. I specialize in making complex concepts easy to understand.',
      subjects: ['Physics', 'Mathematics', 'Astronomy'],
      hourlyRate: 60,
      yearsOfExperience: 12,
      averageRating: 4.9,
      reviewCount: 124,
      nextAvailableAt: '2024-05-15T14:00:00Z',
    },
  },
  {
    favoriteId: 'fav-002',
    createdAt: '2024-05-05T15:30:00Z',
    tutor: {
      id: 'tutor-002',
      fullName: 'James Miller',
      avatarUrl: 'https://i.pravatar.cc/150?u=james',
      bio: 'Expert Calculus tutor with a passion for helping students succeed in their college courses.',
      subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
      hourlyRate: 45,
      yearsOfExperience: 5,
      averageRating: 4.8,
      reviewCount: 86,
    },
  },
];
