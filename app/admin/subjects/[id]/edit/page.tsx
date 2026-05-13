'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SubjectForm, SubjectFormValues } from '@/features/admin-subjects/components/subject-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminSubjectDetailQuery, useUpdateAdminSubjectMutation } from '@/features/admin-subjects';

export default function SubjectEditPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: subject, isLoading, isError } = useAdminSubjectDetailQuery(id);
  const updateMutation = useUpdateAdminSubjectMutation();

  const handleSubmit = async (values: SubjectFormValues) => {
    try {
      await updateMutation.mutateAsync({ id, data: values });
      toast.success('Subject updated successfully');
      router.push(ADMIN_ROUTES.SUBJECTS);
    } catch (error) {
      toast.error('Failed to update subject', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !subject) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Subject not found</h3>
        <p className="text-muted-foreground mt-2">The subject ID you provided does not exist or an error occurred.</p>
        <Button asChild className="mt-6">
          <Link href={ADMIN_ROUTES.SUBJECTS}>Back to Subjects</Link>
        </Button>
      </div>
    );
  }

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
        title="Edit Subject"
        description={`Modify details for ${subject.name}`}
      />

      <div className="max-w-3xl">
        <SubjectForm
          initialValues={subject}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          isEditMode
        />
      </div>
    </>
  );
}
