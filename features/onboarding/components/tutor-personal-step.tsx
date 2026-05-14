'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GENDER_OPTIONS } from '../constants';
import { TutorOnboardingRequest, Gender } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorPersonalStep({ data, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold">Full Name</label>
          <Input 
            value={data.fullName} 
            onChange={(e) => onChange({ fullName: e.target.value })} 
            placeholder="John Doe"
            className={errors?.fullName ? 'border-destructive' : ''}
          />
          {errors?.fullName && <p className="text-xs text-destructive font-medium">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Gender</label>
          <Select 
            onValueChange={(val) => onChange({ gender: val as Gender })} 
            value={data.gender}
          >
            <SelectTrigger className={errors?.gender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.gender && <p className="text-xs text-destructive font-medium">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold">Phone Number</label>
          <Input 
            value={data.phoneNumber} 
            onChange={(e) => onChange({ phoneNumber: e.target.value })} 
            placeholder="+1 234 567 890" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Date of Birth</label>
          <Input 
            type="date" 
            value={data.dateOfBirth} 
            onChange={(e) => onChange({ dateOfBirth: e.target.value })} 
          />
        </div>
      </div>
    </div>
  );
}
