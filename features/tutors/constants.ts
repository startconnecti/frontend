import { TutorSortOption, TutorFilters } from './types';

export const TUTOR_QUERY_KEYS = {
  all: ['tutors'] as const,
  lists: () => [...TUTOR_QUERY_KEYS.all, 'list'] as const,
  list: (filters: TutorFilters) => [...TUTOR_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TUTOR_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TUTOR_QUERY_KEYS.details(), id] as const,
  subjects: () => [...TUTOR_QUERY_KEYS.all, 'subjects'] as const,
};

export const SORT_OPTIONS: { label: string; value: TutorSortOption }[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Highest Rating', value: 'highest_rating' },
  { label: 'Lowest Price', value: 'lowest_price' },
  { label: 'Highest Price', value: 'highest_price' },
  { label: 'Most Reviewed', value: 'most_reviewed' },
  { label: 'Newest', value: 'newest' },
];

export const AVAILABILITY_DAYS = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];
