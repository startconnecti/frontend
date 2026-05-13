'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminAccountForm } from '@/features/admin-admins/components/admin-account-form';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminCreatePage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    toast.info('Admin creation API call placeholder', {
      description: 'This would call POST /api/v1/admin/admins in production.'
    });
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
        <AdminAccountForm onSubmit={handleSubmit} />
      </div>
    </>
  );
}
