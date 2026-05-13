'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminAccountForm, AdminAccountFormValues } from '@/features/admin-admins/components/admin-account-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateAdminAdminMutation } from '@/features/admin-admins';
import { AdminApiError } from '@/lib/admin-api/errors';

export default function AdminCreatePage() {
  const router = useRouter();
  const createMutation = useCreateAdminAdminMutation();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (values: AdminAccountFormValues) => {
    setServerErrors({});
    try {
      await createMutation.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        status: values.status,
        ...(values.password ? { password: values.password } : {}),
      });
      toast.success('Admin account created successfully');
      router.push(ADMIN_ROUTES.ADMINS);
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
          toast.error('Failed to create admin account', {
            description: 'Please fix the highlighted fields and try again.',
          });
        } else {
          setServerErrors({ root: error.message });
          toast.error('Failed to create admin account', { description: error.message });
        }
      } else {
        toast.error('Failed to create admin account', {
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    }
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.ADMINS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Admin Accounts
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Create Admin Account"
        description="Grant administrative access to a new team member."
      />

      <div className="max-w-3xl">
        <AdminAccountForm
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          serverErrors={serverErrors}
        />
      </div>
    </>
  );
}
