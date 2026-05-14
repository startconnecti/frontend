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
import { GraduationCap, Info } from 'lucide-react';
import { setFormErrors } from '@/lib/api/query-utils';

const tutorProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  experienceText: z.string().min(100, 'Experience text must be at least 100 characters'),
  yearsOfExperience: z.coerce.number().min(0),
  hourlyRate: z.coerce.number().min(1),
  subjects: z.array(z.string()).min(1, 'At least one subject is required'),
});

interface TutorProfileFormProps {
  initialData: TutorProfile;
}

export function TutorProfileForm({ initialData }: TutorProfileFormProps) {
  const updateMutation = useUpdateTutorProfileMutation();
  
  const form = useForm<UpdateTutorProfileRequest>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      fullName: initialData.fullName,
      phoneNumber: initialData.phoneNumber,
      bio: initialData.bio,
      experienceText: initialData.experienceText,
      yearsOfExperience: initialData.yearsOfExperience,
      hourlyRate: initialData.hourlyRate,
      subjects: initialData.subjects,
    },
  });

  const onSubmit = async (values: UpdateTutorProfileRequest) => {
    try {
      await updateMutation.mutateAsync(values);
    } catch (err) {
      setFormErrors(err, form.setError);
    }
  };

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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +84 901 234 567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

          {/* Subjects (Simplified Preview/Edit) */}
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none">Subjects</Badge>
                Expertise
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.watch('subjects').map((subject) => (
                  <Badge key={subject} variant="secondary" className="px-4 py-2 text-xs font-bold rounded-xl">
                    {subject}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground italic">Subject management is coming soon in the next update.</p>
            </CardContent>
          </Card>

          {/* Certificates (Preview Only) */}
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-5 w-5" />
                Certificates & Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <div className="space-y-4">
                {initialData.certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/5">
                    <div>
                      <p className="text-sm font-bold">{cert.title}</p>
                      <p className="text-xs text-muted-foreground">{cert.organization} • {cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800">
                <Info className="h-4 w-4 shrink-0" />
                <p className="text-xs font-medium">Certificate updates require high-level verification. Contact support to add new credentials.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4 sticky bottom-8 z-20">
            <Button 
              type="submit" 
              size="lg"
              className="font-black px-12 shadow-2xl shadow-primary/40 h-14 text-lg rounded-2xl transition-all active:scale-95" 
              disabled={updateMutation.isPending || !form.formState.isDirty}
            >
              {updateMutation.isPending ? 'Submitting Changes...' : 'Save & Submit Profile'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
