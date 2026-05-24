'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, GraduationCap, Clock, DollarSign, BookOpen } from 'lucide-react';
import { TutorProfile } from '../types';

interface TutorProfileDisplayProps {
  profile: TutorProfile;
}

export function TutorProfileDisplay({ profile }: TutorProfileDisplayProps) {
  return (
    <div className="space-y-8">
      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <Info className="h-5 w-5 text-primary" />
            Professional Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Hourly Rate
              </p>
              <p className="text-xl font-black text-brand-dark">${profile.hourlyRate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Years of Experience
              </p>
              <p className="text-xl font-black text-brand-dark">{profile.yearsOfExperience} Years</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Bio</p>
            <p className="text-sm text-brand-dark/80 whitespace-pre-wrap bg-muted/5 p-4 rounded-xl border border-border/40">
              {profile.bio || 'No bio provided.'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teaching Experience & Approach</p>
            <p className="text-sm text-brand-dark/80 whitespace-pre-wrap bg-muted/5 p-4 rounded-xl border border-border/40">
              {profile.experienceText || 'No experience details provided.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <BookOpen className="h-5 w-5 text-primary" />
            Expertise & Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-wrap gap-2">
            {profile.subjects && profile.subjects.length > 0 ? (
              profile.subjects.map((subject: any) => {
                const name = typeof subject === 'string' ? subject : subject?.name || '';
                const id = typeof subject === 'string' ? subject : subject?.id || '';
                return (
                  <Badge key={id || name} variant="secondary" className="px-4 py-2 text-xs font-bold rounded-xl">
                    {name}
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground italic">No subjects added.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <GraduationCap className="h-5 w-5 text-primary" />
            Certifications & Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {profile.certificates && profile.certificates.length > 0 ? (
              profile.certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/5">
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.organization} • {cert.year}</p>
                  </div>
                  {cert.certificateUrl && (
                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary hover:underline">
                      View Credential
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No certifications added.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
