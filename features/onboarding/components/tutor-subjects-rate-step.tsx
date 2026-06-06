'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Loader2 } from 'lucide-react';
import { useSubjectsQuery } from '@/features/tutors/hooks/use-subjects-query';
import { TutorOnboardingRequest } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorSubjectsRateStep({ data, onChange, errors }: StepProps) {
  const { data: subjectsList = [], isLoading } = useSubjectsQuery();

  const toggleSubject = (subjectObj: { id: string; name: string }) => {
    const isSelected = data.subjects.some(s => s.id === subjectObj.id);
    const newSubjects = isSelected
      ? data.subjects.filter((s) => s.id !== subjectObj.id)
      : [...data.subjects, subjectObj];
    onChange({ subjects: newSubjects });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold">Subjects You Teach</label>
          <span className="text-[10px] font-bold text-primary uppercase">{data.subjects.length} selected</span>
        </div>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {subjectsList.map((subject) => {
              const isSelected = data.subjects.some(s => s.id === subject.id);
              return (
                <div 
                  key={subject.id} 
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer hover:bg-primary/5 ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/60 bg-muted/5'
                  }`}
                  onClick={() => toggleSubject(subject)}
                >
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSubject(subject)} />
                  <span className="text-xs font-medium truncate">{subject.name}</span>
                </div>
              );
            })}
          </div>
        )}
        {errors?.subjects && <p className="text-xs text-destructive font-medium">{errors.subjects}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">Hourly Rate (VND)</label>
        <div className="relative">
          <Input 
            type="number" 
            placeholder="200000"
            value={data.hourlyRate || ''} 
            onChange={(e) => onChange({ hourlyRate: parseFloat(e.target.value) || 0 })} 
            className={`${errors?.hourlyRate ? 'border-destructive' : ''}`}
          />
        </div>
        {errors?.hourlyRate && <p className="text-xs text-destructive font-medium">{errors.hourlyRate}</p>}
      </div>
    </div>
  );
}
