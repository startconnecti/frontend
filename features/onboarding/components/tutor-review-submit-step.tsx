'use client';

import { Badge } from '@/components/ui/badge';
import { TutorOnboardingRequest } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
}

export function TutorReviewSubmitStep({ data }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Section title="Rate & Subjects" items={[
            { label: 'Hourly Rate', value: `$${data.hourlyRate}/hr` },
            { label: 'Subjects', value: data.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {data.subjects.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
              </div>
            ) : 'None selected' },
          ]} />
        </div>

        <div className="space-y-4">
          <Section title="Teaching" items={[
            { label: 'Experience', value: `${data.yearsOfExperience} years` },
            { label: 'Bio', value: <p className="text-xs line-clamp-3 italic text-muted-foreground mt-1">{data.bio}</p> },
          ]} />

          <div className="p-4 rounded-xl border border-border/60 bg-muted/5 space-y-2">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Verification & Schedule</p>
            <div className="space-y-1">
              <p className="text-xs font-medium">{data.certificates.length} certificates added</p>
              <p className="text-xs font-medium">{data.weeklyAvailability.length} availability slots set</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-2">
        <p className="text-xs font-bold text-primary flex items-center gap-2">
          Admin Approval Notice
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your profile will undergo a manual review process to ensure quality standards. This typically takes 24-48 hours. You will be notified via email once approved.
        </p>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="p-4 rounded-xl border border-border/60 bg-muted/5 space-y-3">
      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
            <div className="text-xs font-semibold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
