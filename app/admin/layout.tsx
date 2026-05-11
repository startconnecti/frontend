import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminShell } from '@/components/admin/admin-shell';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

export const metadata = {
  title: 'Admin Dashboard - Connecti',
  description: 'Connecti Admin Portal',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}