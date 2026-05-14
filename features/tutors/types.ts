export type TutorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Feedback {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number;
}

export interface AvailabilitySlot {
  id?: string;
  day?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  dayOfWeek?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface Tutor {
  id: string;
  fullName: string;
  avatarUrl?: string;
  bio: string;
  experienceText: string;
  subjects: string[];
  hourlyRate: number;
  yearsOfExperience: number;
  averageRating: number;
  reviewCount: number;
  approvalStatus: TutorStatus;
  isPublic: boolean;
  certificates: Certificate[];
  availabilitySlots: AvailabilitySlot[];
  feedbacks: Feedback[];
}

export type TutorSortOption = 
  | 'recommended' 
  | 'highest_rating' 
  | 'lowest_price' 
  | 'highest_price' 
  | 'most_reviewed' 
  | 'newest';

export interface TutorFilters {
  keyword?: string;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availabilityDay?: string;
  sortBy: TutorSortOption;
  page?: number;
  limit?: number;
}
