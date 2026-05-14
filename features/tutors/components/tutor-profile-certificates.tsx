'use client';

import { Award, FileText, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Certificate } from '../types';

interface TutorProfileCertificatesProps {
  certificates: Certificate[];
}

export function TutorProfileCertificates({ certificates }: TutorProfileCertificatesProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Certificates & Education</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className="p-4 flex items-start gap-4 border-border/40 hover:border-primary/20 transition-colors group rounded-2xl">
            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{cert.title}</h4>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{cert.year}</span>
                <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                  <FileText className="h-3 w-3" />
                  View Credential
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
