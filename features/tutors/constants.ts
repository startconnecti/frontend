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
  { label: 'Rate: High to Low', value: 'rate_high' },
  { label: 'Rate: Low to High', value: 'rate_low' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: High to Low', value: 'price_high' },
  { label: 'Price: Low to High', value: 'price_low' },
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
