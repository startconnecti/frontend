'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Award } from 'lucide-react';
import { TutorOnboardingRequest, TutorOnboardingCertificate } from '../types';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
  errors?: Record<string, string>;
}

export function TutorCertificatesStep({ data, onChange, errors }: StepProps) {
  const addCertificate = () => {
    const newCert: TutorOnboardingCertificate = {
      title: '',
      issuer: '',
      year: new Date().getFullYear(),
      fileName: '',
    };
    onChange({ certificates: [...data.certificates, newCert] });
  };

  const removeCertificate = (index: number) => {
    onChange({ certificates: data.certificates.filter((_, i) => i !== index) });
  };

  const updateCertificate = (index: number, field: keyof TutorOnboardingCertificate, value: string | number) => {
    const newCerts = [...data.certificates];
    newCerts[index] = { ...newCerts[index], [field]: value } as TutorOnboardingCertificate;
    onChange({ certificates: newCerts });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-bold">Certificates & Qualifications</label>
          <p className="text-[10px] text-muted-foreground italic">Add your relevant degrees or certifications.</p>
        </div>
        <Button variant="outline" size="sm" onClick={addCertificate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Row
        </Button>
      </div>

      <div className="space-y-4">
        {data.certificates.length === 0 ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-border/40 text-center space-y-3 bg-muted/5">
            <Award className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No certificates added yet. (Optional)</p>
          </div>
        ) : (
          data.certificates.map((cert, index) => (
            <div key={index} className="p-4 rounded-xl border border-border/60 space-y-4 relative bg-muted/5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" 
                onClick={() => removeCertificate(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Title</label>
                  <Input 
                    value={cert.title} 
                    onChange={(e) => updateCertificate(index, 'title', e.target.value)} 
                    placeholder="e.g. Master of Science in Mathematics"
                    className={errors?.[`cert_${index}_title`] ? 'border-destructive' : ''}
                  />
                  {errors?.[`cert_${index}_title`] && <p className="text-[10px] text-destructive">{errors[`cert_${index}_title`]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Issuer</label>
                  <Input 
                    value={cert.issuer} 
                    onChange={(e) => updateCertificate(index, 'issuer', e.target.value)} 
                    placeholder="e.g. University of Cambridge" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Year Issued</label>
                  <Input 
                    type="number" 
                    value={cert.year} 
                    onChange={(e) => updateCertificate(index, 'year', parseInt(e.target.value) || new Date().getFullYear())} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">File (Placeholder)</label>
                  <Input 
                    value={cert.fileName} 
                    onChange={(e) => updateCertificate(index, 'fileName', e.target.value)} 
                    placeholder="certificate.pdf" 
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
