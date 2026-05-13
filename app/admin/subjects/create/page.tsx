'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SubjectForm, SubjectFormValues } from '@/features/admin-subjects/components/subject-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateAdminSubjectMutation } from '@/features/admin-subjects';

export default function SubjectCreatePage() {
  const router = useRouter();
  const createMutation = useCreateAdminSubjectMutation();

  const handleSubmit = async (values: SubjectFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('Subject created successfully');
      router.push(ADMIN_ROUTES.SUBJECTS);
    } catch (error) {
      toast.error('Failed to create subject', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
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
        <SubjectForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
      </div>
    </>
  );
}
