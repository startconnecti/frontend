'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SubjectForm, SubjectFormValues } from '@/features/admin-subjects/components/subject-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateAdminSubjectMutation } from '@/features/admin-subjects';
import { AdminApiError } from '@/lib/admin-api/errors';

export default function SubjectCreatePage() {
  const router = useRouter();
  const createMutation = useCreateAdminSubjectMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: SubjectFormValues) => {
    setServerErrors({});
    try {
      await createMutation.mutateAsync(values);
      toast.success('Subject created successfully');
      router.push(ADMIN_ROUTES.SUBJECTS);
    } catch (error) {
      if (AdminApiError.isAdminApiError(error)) {
        const hasFieldErrors =
          error.fieldErrors != null && Object.keys(error.fieldErrors).length > 0;

        if (hasFieldErrors && error.fieldErrors) {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(error.fieldErrors)) {
            mapped[field] = Array.isArray(messages) ? messages[0] : messages;
          }
          setServerErrors(mapped);
          toast.error('Failed to create subject', {
            description: 'Please fix the highlighted fields and try again.',
          });
        } else {
          // Business error (e.g. Subject.AlreadyExists) — no fieldErrors
          setServerErrors({ root: error.message });
          toast.error('Failed to create subject', { description: error.message });
        }
      } else {
        toast.error('Failed to create subject', {
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    }
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.SUBJECTS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Create New Subject"
        description="Define a new learning category for tutors and students."
      />

      <div className="max-w-3xl">
        <SubjectForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          serverErrors={serverErrors}
        />
      </div>
    </>
  );
}
