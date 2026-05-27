'use client';

import { useTutorProfileChangeRequestDetailQuery } from '@/features/tutor-profile/hooks/use-tutor-profile-change-requests';
import { TutorProfileDraftForm } from '@/features/tutor-profile/components/tutor-profile-draft-form';
import { PageContainer } from '@/components/shared/page-container';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EditChangeRequestPageProps {
  id: string;
}

export function EditChangeRequestPage({ id }: EditChangeRequestPageProps) {
  const router = useRouter();
  const { data: request, isLoading, isError } = useTutorProfileChangeRequestDetailQuery(id);

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </PageContainer>
    );
  }

  if (isError || !request) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Card className="border-border/60 bg-rose-50 border-rose-100 rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900">Request Not Found</h3>
              <p className="text-sm text-rose-700">Unable to load the requested detail page.</p>
            </div>
            <Button variant="outline" className="bg-white border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => router.push('/settings/tutor-profile/change-requests')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (request.status !== 'pending') {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Card className="border-border/60 bg-amber-50 border-amber-100 rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-900">Request Not Editable</h3>
              <p className="text-sm text-amber-700">This request is no longer pending and cannot be edited.</p>
            </div>
            <Button variant="outline" className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => router.push(`/settings/tutor-profile/change-requests/${id}`)}>
              View Details
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const payload = request.changePayload || (request as Record<string, unknown>).change_payload as typeof request.changePayload || {} as typeof request.changePayload;
  const profilePayload = payload.profile || {} as typeof payload.profile;
  const certifications = Array.isArray(payload.certifications) ? payload.certifications : [];
  const subjects = (payload as Record<string, unknown>).subjects ?? payload.subject_ids;
  
  // Map snapshot to TutorProfile expected format for initialData.
  // Preserve BOTH fileUrl and certificateUrl so the draft form can resolve
  // the preview regardless of which schema the stored payload uses.
  const initialData = {
    id: '',
    userId: '',
    fullName: '',
    phoneNumber: '',
    approvalStatus: 'pending' as const,
    isPublic: false,
    bio: profilePayload.bio || '',
    experienceText: profilePayload.experience_text ?? profilePayload.experienceText ?? '',
    yearsOfExperience: profilePayload.years_of_experience ?? profilePayload.yearsOfExperience ?? 0,
    hourlyRate: profilePayload.hourly_rate ?? profilePayload.hourlyRate ?? 0,
    subjects: Array.isArray(subjects) ? subjects.map((s: string | { id: string }) => typeof s === 'string' ? s : s.id) : [],
    certificates: certifications.map((cert: Record<string, unknown>) => {
      // Resolve the canonical document URL — support both old and new schemas
      const resolvedUrl =
        (cert.fileUrl as string | undefined) ??
        (cert.certificateUrl as string | undefined) ??
        (cert.url as string | undefined) ??
        '';

      // Resolve cert name — support new API schema (certificateName) and old (name/title)
      const name =
        (cert.certificateName as string | undefined) ??
        (cert.name as string | undefined) ??
        '';

      // Resolve issuer — support new API schema (issuingOrganization) and old (issuer/organization)
      const organization =
        (cert.issuingOrganization as string | undefined) ??
        (cert.issuer as string | undefined) ??
        (cert.organization as string | undefined) ??
        '';

      // Resolve issued date — support both issueDate (new) and issuedAt (old)
      const rawDate =
        (cert.issueDate as string | undefined) ??
        (cert.issuedAt as string | undefined) ??
        '';
      const yearMatch = rawDate.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

      return {
        id: (cert.id as string | undefined) ?? '',
        title: name,
        organization,
        year,
        // Provide both fields so draft form can pick up preview with either approach
        fileUrl: resolvedUrl || undefined,
        certificateUrl: resolvedUrl || undefined,
        expiryDate: (cert.expiryDate as string | null | undefined) ?? null,
      };
    }),
  };

  return (
    <PageContainer className="py-8 space-y-6 max-w-4xl">
      <Link href={`/settings/tutor-profile/change-requests/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Request Details
      </Link>
      
      <div>
        <h1 className="text-2xl font-black text-brand-dark mb-1">Edit Change Request</h1>
        <p className="text-sm text-muted-foreground">Update your pending profile modifications. This will overwrite your existing pending request.</p>
      </div>

      <TutorProfileDraftForm 
        initialData={initialData} 
        editRequestId={id}
        initialRequestNote={request.requestNote}
        onCancel={() => router.push(`/settings/tutor-profile/change-requests/${id}`)} 
      />
    </PageContainer>
  );
}
