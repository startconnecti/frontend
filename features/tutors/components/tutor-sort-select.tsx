'use client';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SORT_OPTIONS } from '../constants';
import { TutorSortOption } from '../types';

interface TutorSortSelectProps {
  value: TutorSortOption;
  onChange: (value: TutorSortOption) => void;
}

export function TutorSortSelect({ value, onChange }: TutorSortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">Sort by:</span>
      <Select value={value} onValueChange={(val) => onChange(val as TutorSortOption)}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
