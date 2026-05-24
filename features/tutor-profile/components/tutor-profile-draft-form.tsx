'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorProfile, TutorProfileSnapshotCertification } from '../types';
import { useCreateTutorProfileChangeRequestMutation } from '../hooks/use-tutor-profile-change-requests';
import { Badge } from '@/components/ui/badge';
import { Info, GraduationCap, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const tutorProfileDraftSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  experienceText: z.string().min(100, 'Experience text must be at least 100 characters'),
  yearsOfExperience: z.coerce.number().min(0),
  hourlyRate: z.coerce.number().min(1),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
});

type DraftFormValues = z.infer<typeof tutorProfileDraftSchema>;

interface TutorProfileDraftFormProps {
  initialData: TutorProfile;
  onCancel: () => void;
}

export function TutorProfileDraftForm({ initialData, onCancel }: TutorProfileDraftFormProps) {
  const changeRequestMutation = useCreateTutorProfileChangeRequestMutation();
  
  // Local state for snapshot tracking of certifications
  const [localCertifications, setLocalCertifications] = useState<TutorProfileSnapshotCertification[]>(
    initialData.certificates.map(cert => ({
      id: cert.id,
      name: cert.title,
      issuer: cert.organization,
      issuedAt: cert.year.toString(),
      certificateUrl: cert.certificateUrl || '',
    }))
  );

  const form = useForm<DraftFormValues>({
    resolver: zodResolver(tutorProfileDraftSchema),
    defaultValues: {
      bio: initialData.bio || '',
      experienceText: initialData.experienceText || '',
      yearsOfExperience: initialData.yearsOfExperience || 0,
      hourlyRate: initialData.hourlyRate || 0,
      subjects: initialData.subjects?.map((s: any) => typeof s === 'string' ? s : s.id) || [],
    },
  });

  const onSubmit = async (values: DraftFormValues) => {
    try {
      await changeRequestMutation.mutateAsync({
        change_payload: {
          profile: {
            bio: values.bio,
            experience_text: values.experienceText,
            years_of_experience: values.yearsOfExperience,
            hourly_rate: values.hourlyRate,
          },
          subject_ids: values.subjects,
          certifications: localCertifications,
        },
        request_note: 'Unified snapshot change request',
      });
      toast.success("Change request submitted successfully");
      onCancel();
    } catch (error) {
      toast.error("Failed to submit change request");
    }
  };

  const handleRemoveCert = (indexToRemove: number) => {
    setLocalCertifications(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleAddMockCert = () => {
    // Note: In a full implementation, this would open a modal to upload a file and fill details
    const newCert: TutorProfileSnapshotCertification = {
      name: 'New Certification Draft',
      issuer: 'Draft Issuer',
      issuedAt: new Date().getFullYear().toString(),
      certificateUrl: 'https://example.com/draft.pdf',
    };
    setLocalCertifications(prev => [...prev, newCert]);
    toast.success("Draft certification added");
  };

  return (
    <div className="space-y-8">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="flex gap-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Draft Mode Active</h4>
            <p className="text-sm">Changes made here will be packaged into a single change request for admin review.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onCancel} className="bg-white border-amber-200 text-amber-700 hover:bg-amber-100">
          Cancel Draft
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <Info className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell students about yourself and your teaching style..." 
                        className="min-h-[120px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your background..." 
                        className="min-h-[120px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <GraduationCap className="h-5 w-5 text-primary" />
                Certifications
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMockCert} className="gap-2">
                <Plus className="h-4 w-4" /> Add Certificate
              </Button>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              {localCertifications.length > 0 ? (
                localCertifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/5 group">
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.issuedAt}</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveCert(index)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No certifications in snapshot.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4 sticky bottom-8 z-20">
            <Button 
              type="submit" 
              size="lg"
              className="font-black px-12 shadow-2xl shadow-primary/40 h-14 text-lg rounded-2xl transition-all active:scale-95" 
              disabled={changeRequestMutation.isPending}
            >
              {changeRequestMutation.isPending ? 'Submitting...' : 'Submit Change Request Snapshot'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
