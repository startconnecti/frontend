'use client';

import { Search, RotateCcw, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TutorFilters } from '../types';
import { AVAILABILITY_DAYS } from '../constants';
import { useSubjectsQuery } from '../hooks/use-subjects-query';

interface TutorFilterPanelProps {
  filters: TutorFilters;
  updateFilter: <K extends keyof TutorFilters>(key: K, value: TutorFilters[K]) => void;
  resetFilters: () => void;
}

export function TutorFilterPanel({ filters, updateFilter, resetFilters }: TutorFilterPanelProps) {
  const { data: subjects = [] } = useSubjectsQuery();

  return (
    <div className="space-y-8">
      {/* Subject Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
        <Select 
          value={filters.subjectId || 'all'} 
          onValueChange={(val) => updateFilter('subjectId', val === 'all' ? undefined : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range</Label>
          <span className="text-xs font-medium">${filters.minPrice ?? 0} - ${filters.maxPrice ?? 150}+</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground">Min ($)</span>
              <Input 
                type="number" 
                placeholder="0"
                value={filters.minPrice ?? ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground">Max ($)</span>
              <Input 
                type="number" 
                placeholder="150"
                value={filters.maxPrice ?? ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="h-8"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Minimum Rating</Label>
        <div className="flex flex-col gap-2">
          {[4.5, 4, 3.5, 3].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter('minRating', filters.minRating === rating ? undefined : rating)}
              className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-colors ${
                filters.minRating === rating ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} 
                  />
                ))}
              </div>
              <span>{rating}+ stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Availability</Label>
        <Select 
          value={filters.availabilityDay ?? 'all'} 
          onValueChange={(val) => updateFilter('availabilityDay', val === 'all' ? undefined : val)}
        >
          <SelectTrigger>
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

      {/* Reset Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full gap-2 text-xs"
        onClick={resetFilters}
      >
        <RotateCcw className="h-3 w-3" />
        Reset All Filters
      </Button>
    </div>
  );
}
