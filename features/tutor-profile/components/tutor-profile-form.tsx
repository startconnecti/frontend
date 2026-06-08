'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorProfile, UpdateTutorProfileRequest } from '../types';
import { useUpdateTutorProfileMutation } from '../hooks/use-update-tutor-profile-mutation';
import { Badge } from '@/components/ui/badge';
import { Info, Lock, Edit3 } from 'lucide-react';
import { setFormErrors } from '@/lib/api/query-utils';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCreateTutorProfileMutation } from '../hooks/use-create-tutor-profile-mutation';
import { useSubjectsQuery } from '@/features/tutors/hooks/use-subjects-query';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

const tutorProfileSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  experienceText: z.string().min(100, 'Experience text must be at least 100 characters'),
  yearsOfExperience: z.coerce.number().min(0, 'Years of experience must be 0 or greater'),
  hourlyRate: z.coerce.number().min(1),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
});

interface TutorProfileFormProps {
  initialData: TutorProfile | null;
  isCreating?: boolean;
}

export function TutorProfileForm({ initialData, isCreating = false }: TutorProfileFormProps) {
  const updateMutation = useUpdateTutorProfileMutation();
  const createMutation = useCreateTutorProfileMutation();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { data: availableSubjects = [] } = useSubjectsQuery();
  
  const form = useForm<UpdateTutorProfileRequest>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: initialData?.bio || '',
      experienceText: initialData?.experienceText || '',
      yearsOfExperience: initialData?.yearsOfExperience || 0,
      hourlyRate: initialData?.hourlyRate || 0,
      subjects: initialData?.subjects || [],
    },
  });

  const onSubmit = async (values: UpdateTutorProfileRequest) => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync(values);
        return;
      }

      const payload = {
        ...values,
        tutorId: currentUserId,
      };

      if (!payload.tutorId) {
        toast.error("User ID is missing");
        return;
      }

      await updateMutation.mutateAsync(payload);
    } catch (err) {
      setFormErrors(err, form.setError);
    }
  };

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <Info className="h-5 w-5 text-primary" />
                Basic Information
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
                      <FormDescription>This is your public rate per hour.</FormDescription>
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
                    <FormDescription>Minimum 50 characters. This appears on your profile card.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experienceText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Experience & Approach</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your background, methodologies, and successes..." 
                        className="min-h-[180px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Minimum 100 characters. Detailed breakdown of your teaching journey.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Subjects (Multi-select) */}
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none">Subjects</Badge>
                Expertise
              </CardTitle>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {(form.watch('subjects') || []).length} Selected
              </span>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSubjects.map((subject) => {
                        const currentSubjects = field.value || [];
                        const isSelected = currentSubjects.some(
                          (s: string | { id: string }) => (typeof s === 'string' ? s : s.id) === subject.id
                        );

                        return (
                          <button
                            key={subject.id}
                            type="button"
                            onClick={() => {
                              const newValue = isSelected
                                ? currentSubjects.filter((s: string | { id: string }) => (typeof s === 'string' ? s : s.id) !== subject.id)
                                : [...currentSubjects, subject.id];
                              field.onChange(newValue);
                            }}
                            className={cn(
                              "flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold text-left transition-all select-none hover:shadow-sm",
                              isSelected
                                ? "bg-primary/5 border-primary text-primary"
                                : "bg-background border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <span className="truncate pr-2">{subject.name}</span>
                            {isSelected && (
                              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                                <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {!isCreating && initialData && (
            <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                  <Info className="h-5 w-5" />
                  Certificates & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="space-y-4">
                  {initialData.certificates.map((cert) => {
                    const rawUrl = cert.fileUrl ?? cert.certificateUrl ?? null;
                    const absoluteUrl = getMediaUrl(rawUrl) || null;

                    return (
                      <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/5">
                        <div className="flex items-start gap-4">
                          {absoluteUrl && absoluteUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                            <div className="relative h-12 w-16 overflow-hidden rounded-md border bg-white shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={absoluteUrl} alt="Certificate" className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : absoluteUrl ? (
                            <div className="flex h-12 w-16 items-center justify-center rounded-md border bg-white shrink-0">
                              <span className="text-xs font-bold text-muted-foreground">FILE</span>
                            </div>
                          ) : null}
                          <div>
                            <p className="text-sm font-bold">{cert.title}</p>
                            <p className="text-xs text-muted-foreground">{cert.organization} • {cert.year}</p>
                          </div>
                        </div>
                        {absoluteUrl && (
                          <Button variant="outline" size="sm" asChild className="shrink-0">
                            <a href={absoluteUrl} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {initialData.certificates.length === 0 && (
                    <p className="text-sm text-muted-foreground">No certificates added.</p>
                  )}
                </div>
                <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                  <Info className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-medium">Certificate management is only available via Change Requests once your profile is approved. For now, existing certificates are locked.</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end pt-4 sticky bottom-8 z-20">
            <Button 
              type="submit" 
              size="lg"
              className="font-black px-12 shadow-2xl shadow-primary/40 h-14 text-lg rounded-2xl transition-all active:scale-95" 
              disabled={isPending || (!form.formState.isDirty && !isCreating)}
            >
              {isPending ? 'Submitting...' : isCreating ? 'Save & Continue Later' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
