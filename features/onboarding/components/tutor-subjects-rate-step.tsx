'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign } from 'lucide-react';
import { SUBJECT_OPTIONS } from '../constants';
import { TutorOnboardingRequest } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorSubjectsRateStep({ data, onChange, errors }: StepProps) {
  const toggleSubject = (subject: string) => {
    const newSubjects = data.subjects.includes(subject)
      ? data.subjects.filter((s) => s !== subject)
      : [...data.subjects, subject];
    onChange({ subjects: newSubjects });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">Subjects You Teach</label>
          <span className="text-[10px] font-bold text-primary uppercase">{data.subjects.length} selected</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUBJECT_OPTIONS.map((subject) => (
            <div 
              key={subject} 
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer hover:bg-primary/5 ${
                data.subjects.includes(subject) 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border/60 bg-muted/5'
              }`}
              onClick={() => toggleSubject(subject)}
            >
              <Checkbox checked={data.subjects.includes(subject)} onCheckedChange={() => toggleSubject(subject)} />
              <span className="text-xs font-medium truncate">{subject}</span>
            </div>
          ))}
        </div>
        {errors?.subjects && <p className="text-xs text-destructive font-medium">{errors.subjects}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">Hourly Rate (USD)</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="number" 
            value={data.hourlyRate} 
            onChange={(e) => onChange({ hourlyRate: parseFloat(e.target.value) || 0 })} 
            className={`pl-9 ${errors?.hourlyRate ? 'border-destructive' : ''}`}
          />
        </div>
        {errors?.hourlyRate && <p className="text-xs text-destructive font-medium">{errors.hourlyRate}</p>}
      </div>
    </div>
  );
}
