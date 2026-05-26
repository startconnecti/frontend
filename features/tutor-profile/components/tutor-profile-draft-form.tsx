'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorProfile, TutorProfileSnapshotCertification } from '../types';
import { useCreateTutorProfileChangeRequestMutation } from '../hooks/use-tutor-profile-change-requests';
import { Badge } from '@/components/ui/badge';
import { Info, GraduationCap, X, Plus, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSubjectsQuery } from '@/features/tutors/hooks/use-subjects-query';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

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
  const { data: availableSubjects = [] } = useSubjectsQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingCertIndex, setReplacingCertIndex] = useState<number | null>(null);
  
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
      subjects: initialData.subjects?.map((s: string | { id: string }) => typeof s === 'string' ? s : s.id) || [],
    },
  });

  // Preload snapshot values if editing an existing request
  useEffect(() => {
    const editPayloadRaw = sessionStorage.getItem('editSnapshotPayload');
    if (editPayloadRaw) {
      try {
        const editPayload = JSON.parse(editPayloadRaw);
        sessionStorage.removeItem('editSnapshotPayload'); // clear immediately

        if (editPayload.profile) {
          form.setValue('bio', editPayload.profile.bio || '');
          form.setValue('experienceText', editPayload.profile.experience_text ?? editPayload.profile.experienceText ?? '');
          form.setValue('yearsOfExperience', editPayload.profile.years_of_experience ?? editPayload.profile.yearsOfExperience ?? 0);
          form.setValue('hourlyRate', editPayload.profile.hourly_rate ?? editPayload.profile.hourlyRate ?? 0);
        }

        const subjects = editPayload.subjects || editPayload.subject_ids;
        if (subjects && Array.isArray(subjects)) {
          form.setValue('subjects', subjects.map((s: any) => typeof s === 'string' ? s : s.id));
        }

        if (editPayload.certifications && Array.isArray(editPayload.certifications)) {
          // Map certifications
          setLocalCertifications(editPayload.certifications.map((cert: any) => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            issuedAt: cert.issuedAt,
            certificateUrl: cert.certificateUrl || cert.url || cert.fileUrl || '',
          })));
        }
      } catch (e) {
        console.error('Failed to parse edit payload', e);
      }
    }
  }, [form]);

  const onSubmit = async (values: DraftFormValues) => {
    try {
      await changeRequestMutation.mutateAsync({
        snapshot: {
          profile: {
            bio: values.bio,
            experience_text: values.experienceText,
            years_of_experience: values.yearsOfExperience,
            hourly_rate: values.hourlyRate,
          },
          subject_ids: values.subjects,
          certifications: localCertifications.map(cert => ({
            id: cert.id,
            name: cert.name,
            issuer: cert.issuer,
            issuedAt: cert.issuedAt,
            certificateUrl: cert.certificateUrl,
            tempFileKey: cert.file ? cert.tempFileKey : undefined,
            file: cert.file, // Passed down to mutation layer which strips it
          })),
        },
        request_note: 'Unified snapshot change request',
      });
      toast.success("Change request submitted successfully");
      onCancel();
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit change request");
      }
    }
  };

  const handleRemoveCert = (indexToRemove: number) => {
    setLocalCertifications(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleAddCertClick = () => {
    setReplacingCertIndex(null);
    fileInputRef.current?.click();
  };

  const handleReplaceCertClick = (index: number) => {
    setReplacingCertIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (replacingCertIndex !== null) {
      // Replacing existing certificate file
      setLocalCertifications(prev => {
        const copy = [...prev];
        copy[replacingCertIndex] = {
          ...copy[replacingCertIndex],
          tempFileKey: `cert_replace_${Date.now()}`,
          file,
        };
        return copy;
      });
      toast.success("Certificate file replaced.");
    } else {
      // Adding new certificate
      const newCert: TutorProfileSnapshotCertification = {
        name: 'New Certification Draft',
        issuer: 'Draft Issuer',
        issuedAt: new Date().getFullYear().toString(),
        tempFileKey: `cert_new_${Date.now()}`,
        file,
      };
      setLocalCertifications(prev => [...prev, newCert]);
      toast.success("Certificate file added. Please edit its details.");
    }
    
    setReplacingCertIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateCert = (index: number, field: keyof TutorProfileSnapshotCertification, value: string) => {
    setLocalCertifications(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
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

          {/* Subjects (Multi-select) */}
          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
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

          <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-muted/10 border-b border-border/40 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
                <GraduationCap className="h-5 w-5 text-primary" />
                Certifications
              </CardTitle>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange} 
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddCertClick} className="gap-2">
                  <Upload className="h-4 w-4" /> Add Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-4">
              {localCertifications.length > 0 ? (
                localCertifications.map((cert, index) => (
                  <div key={index} className="flex flex-col gap-3 p-5 rounded-xl border border-border/40 bg-muted/5 relative group">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveCert(index)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Certificate Name</label>
                        <Input 
                          value={cert.name} 
                          onChange={(e) => updateCert(index, 'name', e.target.value)} 
                          className="h-9 bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Issuer Organization</label>
                        <Input 
                          value={cert.issuer} 
                          onChange={(e) => updateCert(index, 'issuer', e.target.value)} 
                          className="h-9 bg-white" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Year Issued</label>
                        <Input 
                          value={cert.issuedAt} 
                          onChange={(e) => updateCert(index, 'issuedAt', e.target.value)} 
                          className="h-9 bg-white" 
                        />
                      </div>
                      <div className="space-y-1 flex flex-col justify-end">
                        {cert.tempFileKey ? (
                          <div className="h-9 flex items-center justify-between px-3 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                            <span className="flex items-center truncate mr-2">
                              <Check className="h-4 w-4 mr-2 shrink-0" />
                              <span className="truncate">File attached ({cert.file?.name})</span>
                            </span>
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 shrink-0 hover:bg-emerald-100" onClick={() => handleReplaceCertClick(index)}>
                              Replace
                            </Button>
                          </div>
                        ) : cert.certificateUrl ? (
                          <div className="h-9 flex items-center justify-between px-3 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 transition-colors">
                            <a href={cert.certificateUrl} target="_blank" rel="noreferrer" className="hover:underline truncate mr-2">
                              View Existing Document
                            </a>
                            <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 shrink-0 hover:bg-blue-100" onClick={() => handleReplaceCertClick(index)}>
                              Replace
                            </Button>
                          </div>
                        ) : (
                          <div className="h-9 flex items-center px-3 rounded-md bg-rose-50 text-rose-700 text-sm font-medium border border-rose-100">
                            No file attached
                          </div>
                        )}
                      </div>
                    </div>
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
