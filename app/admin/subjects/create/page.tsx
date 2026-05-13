'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SubjectForm } from '@/features/admin-subjects/components/subject-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SubjectCreatePage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    // In a real app, we would call the mutation here
    // Since we are upgrading the UI and following the prompt's instruction 
    // to build the UI even if backend APIs are missing:
    toast.info('Subject creation API call placeholder', {
      description: 'This would call POST /api/v1/admin/subjects in production.'
    });
    
    // Simulate navigation after successful "mock" submit
    // In a real app, this would be inside mutation.onSuccess
    // router.push(ADMIN_ROUTES.SUBJECTS);
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
        <SubjectForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}
