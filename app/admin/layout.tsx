import { AdminShell } from '@/components/admin/admin-shell';

export const metadata = {
  title: 'Admin Dashboard - Connecti',
  description: 'Connecti Admin Portal',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
