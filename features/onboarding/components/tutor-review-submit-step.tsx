'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorOnboardingRequest } from '../types';
import { Calendar, Award, BookOpen, User, DollarSign, FileText } from 'lucide-react';

interface StepProps {
  data: TutorOnboardingRequest;
  onChange: (data: Partial<TutorOnboardingRequest>) => void;
}

export function TutorReviewSubmitStep({ data }: StepProps) {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Headline / Bio</p>
              <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{data.bio || 'Not provided'}</div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Teaching Experience</p>
                <div className="text-sm font-medium">
                  {data.yearsOfExperience} {data.yearsOfExperience === 1 ? 'year' : 'years'}
                </div>
                {data.experienceText && (
                  <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap border-l-2 pl-3 border-muted">
                    {data.experienceText}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hourly Rate</p>
                <div className="text-lg font-black text-brand-dark flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  {new Intl.NumberFormat('vi-VN').format(data.hourlyRate)} VND<span className="text-sm text-muted-foreground font-medium">/hr</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Section */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.subjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.subjects.map(subject => (
                <Badge key={subject} variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-muted/50">
                  {subject}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No subjects selected.</p>
          )}
        </CardContent>
      </Card>

      {/* Certificates Section */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certificates.map((cert, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
                  <div>
                    <h4 className="font-bold text-base">{cert.title || 'Untitled Certificate'}</h4>
                    <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
                  </div>
                  
                  {cert.description && (
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  )}
                  
                  <div className="pt-2 border-t flex items-center gap-2 text-sm font-medium text-primary">
                    <FileText className="h-4 w-4" />
                    {cert.file ? cert.file.name : cert.fileName ? cert.fileName : 'No file attached'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No certificates added.</p>
          )}
        </CardContent>
      </Card>

      {/* Weekly Availability Section */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.weeklyAvailability.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {daysOfWeek.map(day => {
                const slots = data.weeklyAvailability.filter(a => a.dayOfWeek === day);
                if (slots.length === 0) return null;
                
                return (
                  <div key={day} className="space-y-3">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground border-b pb-2">
                      {day}
                    </h4>
                    <div className="space-y-2">
                      {slots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No availability set.</p>
          )}
        </CardContent>
      </Card>

      {/* Approval Notice */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary">Admin Approval Notice</p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            Your profile will undergo a manual review process to ensure quality standards. This typically takes 24-48 hours. You will be notified via email once approved.
          </p>
        </div>
      </div>
    </div>
  );
}
