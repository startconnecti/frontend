'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminRolesQuery } from '@/features/admin-roles';

const permissionGroups = ['users', 'tutors', 'bookings', 'sessions', 'payments', 'refunds', 'disputes', 'subjects', 'admins'] as const;

export default function RolesPage() {
  const { data: rolesData, isLoading, isError } = useAdminRolesQuery({});

  if (isLoading) {
    return (
      <>
        <AdminPageHeader title="Roles & Permissions" description="Manage admin roles and their permissions." />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="border-b border-border px-6 py-4">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (isError || !rolesData) {
    return (
      <>
        <AdminPageHeader title="Roles & Permissions" description="Manage admin roles and their permissions." />
        <Card className="p-6 text-center text-destructive">
          Error loading roles
        </Card>
      </>
    );
  }

  if (rolesData.items.length === 0) {
    return (
      <>
        <AdminPageHeader title="Roles & Permissions" description="Manage admin roles and their permissions." />
        <Card className="p-6 text-center text-muted-foreground">
          No roles found
        </Card>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="Roles & Permissions" description="Manage admin roles and their permissions." />

      <div className="space-y-6">
        {rolesData.items.map(role => (
          <Card key={role.id} className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-bold text-foreground capitalize">
                {role.name.replace(/_/g, ' ')}
              </h3>
              {role.description && (
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              )}
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-bold">Resource</th>
                      <th className="px-4 py-3 text-center font-bold">Create</th>
                      <th className="px-4 py-3 text-center font-bold">Read</th>
                      <th className="px-4 py-3 text-center font-bold">Update</th>
                      <th className="px-4 py-3 text-center font-bold">Delete</th>
                      <th className="px-4 py-3 text-center font-bold">Approve</th>
                      <th className="px-4 py-3 text-center font-bold">Reject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionGroups.map(group => {
                      const permissions = role.permissions[group] ?? [];
                      return (
                        <tr key={group} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium capitalize text-foreground">{group}</td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('create') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('read') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('update') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('delete') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('approve') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(permissions as string[]).includes('reject') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
