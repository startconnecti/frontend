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
  status?: 'available' | 'blocked' | string;
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
  totalReviews: number;
  approvalStatus: TutorStatus;
  isPublic: boolean;
  certificates: Certificate[];
  certifications: Certificate[];
  availabilitySlots: AvailabilitySlot[];
  weeklyAvailability: AvailabilitySlot[];
  feedbacks: Feedback[];
  isFavorite?: boolean;
}

export type TutorSortOption =
  | 'oldest'
  | 'newest'
  | 'rate_high'
  | 'rate_low'
  | 'price_high'
  | 'price_low'
  | 'recommended'
  | 'highest_rating'
  | 'lowest_price'
  | 'highest_price'
  | 'most_reviewed';

export interface Subject {
  id: string;
  name: string;
  slug?: string;
  status?: string;
  isActive?: boolean;
}

export interface TutorFilters {
  keyword?: string;
  subjectId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availabilityDay?: string;
  sortBy?: TutorSortOption;
  sortedBy?: TutorSortOption;
  page?: number;
  limit?: number;
  offset?: number;
}
