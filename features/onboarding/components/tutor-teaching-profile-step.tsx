'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TutorOnboardingRequest } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorTeachingProfileStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold">Professional Bio</label>
        <Textarea 
          value={data.bio} 
          onChange={(e) => onChange({ bio: e.target.value })} 
          placeholder="Tell students about your teaching philosophy and experience..." 
          className={`min-h-[150px] ${errors?.bio ? 'border-destructive' : ''}`}
        />
        <p className="text-[10px] text-muted-foreground">Minimum 50 characters.</p>
        {errors?.bio && <p className="text-xs text-destructive font-medium">{errors.bio}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">Years of Experience</label>
        <Input 
          type="number" 
          value={data.yearsOfExperience} 
          onChange={(e) => onChange({ yearsOfExperience: parseInt(e.target.value) || 0 })} 
          className={errors?.yearsOfExperience ? 'border-destructive' : ''}
        />
        {errors?.yearsOfExperience && <p className="text-xs text-destructive font-medium">{errors.yearsOfExperience}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">Experience Highlights</label>
        <Textarea 
          value={data.experienceText} 
          onChange={(e) => onChange({ experienceText: e.target.value })} 
          placeholder="List key achievements or institutions you've worked with..." 
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
