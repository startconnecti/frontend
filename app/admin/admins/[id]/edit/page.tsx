'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminAccountForm } from '@/features/admin-admins/components/admin-account-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminAdminsQuery } from '@/features/admin-admins';
import { PAGINATION } from '@/constants/pagination';

export default function AdminEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: adminsData, isLoading } = useAdminAdminsQuery({
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    page: 1,
  });

  const admin = adminsData?.items.find((a) => a.id === id);

  const handleSubmit = async (values: any) => {
    toast.info('Admin update API call placeholder', {
      description: `This would call PATCH /api/v1/admin/admins/${id} in production.`
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Admin account not found</h3>
        <p className="text-muted-foreground mt-2">The admin ID you provided does not exist.</p>
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
        <AdminAccountForm initialValues={admin} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
