'use client';

import { RotateCcw, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AVAILABILITY_DAYS } from '../constants';
import { useSubjectsQuery } from '../hooks/use-subjects-query';
import { TutorFilters } from '../types';

interface StudentTutorFilterFormProps {
  filters: TutorFilters;
  updateFilter: <K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) => void;
  resetFilters: () => void;
}

export function StudentTutorFilterForm({ filters, updateFilter, resetFilters }: StudentTutorFilterFormProps) {
  const { data: subjects = [] } = useSubjectsQuery();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, subject, or keyword..."
            className="h-11 pl-10"
            value={filters.keyword || ''}
            onChange={(e) => updateFilter('keyword', e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 sm:w-44 gap-2" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
          Reset All Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Subject</Label>
          <Select
            value={filters.subjectId || 'all'}
            onValueChange={(val) => updateFilter('subjectId', val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Min Price</Label>
          <Input
            type="number"
            placeholder="Min"
            className="h-10"
            value={filters.minPrice ?? ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Max Price</Label>
          <Input
            type="number"
            placeholder="Max"
            className="h-10"
            value={filters.maxPrice ?? ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Minimum Rating</Label>
          <div className="flex h-10 items-center gap-1 px-1">
            {[1, 2, 3, 4, 5].map((rating) => {
              const isActive = (filters.minRating ?? 0) >= rating;
              return (
                <button
                  key={rating}
                  type="button"
                  className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => updateFilter('minRating', filters.minRating === rating ? undefined : rating)}
                  aria-label={`${rating} stars minimum`}
                >
                  <Star className={`h-5 w-5 ${isActive ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40 hover:text-amber-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground">Available Day</Label>
          <Select
            value={filters.availabilityDay ?? 'all'}
            onValueChange={(val) => updateFilter('availabilityDay', val === 'all' ? undefined : val)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Any day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any day</SelectItem>
              {AVAILABILITY_DAYS.map((day) => (
                <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
