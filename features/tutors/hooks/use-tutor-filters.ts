import { useState, useCallback } from 'react';
import { TutorFilters, TutorSortOption } from '../types';

const initialFilters: TutorFilters = {
  keyword: '',
  subjectId: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minRating: undefined,
  availabilityDay: 'all',
  sortBy: 'recommended',
};

export function useTutorFilters() {
  const [filters, setFilters] = useState<TutorFilters>(initialFilters);

  const updateFilter = useCallback(<K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
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
