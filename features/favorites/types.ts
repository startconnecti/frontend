export interface FavoriteTutor {
  favoriteId: string;
  createdAt: string;
  tutor: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    bio: string;
    subjects: string[];
    hourlyRate: number;
    yearsOfExperience: number;
    averageRating: number;
    reviewCount: number;
    nextAvailableAt?: string;
  };
}
