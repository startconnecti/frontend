'use client';

import { Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Certificate } from '../types';

interface TutorProfileCertificatesProps {
  certificates: Certificate[];
}

export function TutorProfileCertificates({ certificates }: TutorProfileCertificatesProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Certificates &amp; Education</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <Card
            key={cert.id}
            className="p-4 flex items-start gap-4 border-border/40 hover:border-primary/20 transition-colors rounded-2xl"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{cert.title}</h4>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
              {cert.year > 0 && (
                <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mt-0.5 block">
                  {cert.year}
                  {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ''}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
