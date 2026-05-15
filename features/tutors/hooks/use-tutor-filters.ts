import { useState, useCallback } from 'react';
import { TutorFilters, TutorSortOption } from '../types';

const initialFilters: TutorFilters = {
  keyword: '',
  subjectId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availabilityDay: undefined,
  sortedBy: 'rate_high',
  limit: 10,
  offset: undefined,
};

export function useTutorFilters() {
  const [filters, setFilters] = useState<TutorFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: key === 'offset' ? value as number : 0,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
}
