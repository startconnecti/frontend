'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SubjectForm } from '@/features/admin-subjects/components/subject-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminSubjectsQuery } from '@/features/admin-subjects';
import { PAGINATION } from '@/constants/pagination';

export default function SubjectEditPage() {
  const { id } = useParams();
  const router = useRouter();

  // We reuse the list query to find the specific subject by ID from the cache or fetch
  // In a real app, we might have a specific useAdminSubjectQuery(id)
  const { data: subjectsData, isLoading } = useAdminSubjectsQuery({
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    page: 1,
  });

  const subject = subjectsData?.items.find((s) => s.id === id);

  const handleSubmit = async (values: any) => {
    toast.info('Subject update API call placeholder', {
      description: `This would call PATCH /api/v1/admin/subjects/${id} in production.`
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Subject not found</h3>
        <p className="text-muted-foreground mt-2">The subject ID you provided does not exist.</p>
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
        <SubjectForm initialValues={subject} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
