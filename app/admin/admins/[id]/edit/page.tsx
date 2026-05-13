'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminAccountForm, AdminAccountFormValues } from '@/features/admin-admins/components/admin-account-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminAdminDetailQuery, useUpdateAdminAdminMutation } from '@/features/admin-admins';
import { AdminApiError } from '@/lib/admin-api/errors';

export default function AdminEditPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const { data: admin, isLoading, isError } = useAdminAdminDetailQuery(id);
  const updateMutation = useUpdateAdminAdminMutation();

  const handleSubmit = async (values: AdminAccountFormValues) => {
    setServerErrors({});
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          status: values.status,
          ...(values.password ? { password: values.password } : {}),
        },
      });
      toast.success('Admin account updated successfully');
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
          toast.error('Failed to update admin account', {
            description: 'Please fix the highlighted fields and try again.',
          });
        } else {
          setServerErrors({ root: error.message });
          toast.error('Failed to update admin account', { description: error.message });
        }
      } else {
        toast.error('Failed to update admin account', {
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !admin) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Admin account not found</h3>
        <p className="text-muted-foreground mt-2">The admin ID you provided does not exist or an error occurred.</p>
        <Button asChild className="mt-6">
          <Link href={ADMIN_ROUTES.ADMINS}>Back to Admins</Link>
        </Button>
      </div>
    );
  }

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
        title="Edit Admin Account"
        description={`Modify access levels for ${admin.fullName}`}
      />

      <div className="max-w-3xl">
        <AdminAccountForm
          initialValues={admin as Partial<AdminAccountFormValues>}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
          isEditMode
          serverErrors={serverErrors}
        />
      </div>
    </>
  );
}
