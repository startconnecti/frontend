import { Tutor, TutorFilters, TutorSortOption } from '../types';
import { MOCK_TUTORS } from '../mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tutorService = {
  async getTutors(filters: TutorFilters): Promise<Tutor[]> {
    await delay(Math.floor(Math.random() * (600 - 300 + 1) + 300));

    let filtered = MOCK_TUTORS.filter(t => t.approvalStatus === 'approved' && t.isPublic);

    // Apply filters
    if (filters.subject && filters.subject !== 'all') {
      filtered = filtered.filter(t => t.subjects.includes(filters.subject!));
    }

    if (filters.keyword) {
      const lowerKeyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(t => 
        t.fullName.toLowerCase().includes(lowerKeyword) || 
        t.bio.toLowerCase().includes(lowerKeyword) ||
        t.subjects.some(s => s.toLowerCase().includes(lowerKeyword))
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(t => t.hourlyRate >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(t => t.hourlyRate <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter(t => t.averageRating >= filters.minRating!);
    }

    if (filters.availabilityDay && filters.availabilityDay !== 'all') {
      filtered = filtered.filter(t => 
        t.availabilitySlots.some(s => s.day === filters.availabilityDay)
      );
    }

    // Apply Sorting
    switch (filters.sortBy) {
      case 'highest_rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'lowest_price':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'highest_price':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'most_reviewed':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        // Mock newest by comparing IDs in reverse
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // 'recommended' - default mock sort
        break;
    }

    return filtered;
  },

  async getTutorById(id: string, publicOnly: boolean = false): Promise<Tutor | null> {
    await delay(Math.floor(Math.random() * (600 - 300 + 1) + 300));
    const tutor = MOCK_TUTORS.find(t => t.id === id);
    if (!tutor) return null;
    if (publicOnly && (tutor.approvalStatus !== 'approved' || !tutor.isPublic)) {
      return null;
    }
    return tutor;
  },

  async getSubjects(): Promise<string[]> {
    await delay(200);
    const subjectsSet = new Set<string>();
    MOCK_TUTORS.forEach(t => t.subjects.forEach(s => subjectsSet.add(s)));
    return Array.from(subjectsSet).sort();
  }
};
