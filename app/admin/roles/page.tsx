'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { mockRoles } from '@/lib/admin/mock-data';
import type { PermissionGroup } from '@/lib/admin/types';

const permissionGroups: PermissionGroup[] = ['users', 'tutors', 'bookings', 'sessions', 'payments', 'refunds', 'disputes', 'subjects', 'admins'];

export default function RolesPage() {
  return (
    <>
      <AdminPageHeader title="Roles & Permissions" description="Manage admin roles and their permissions." />

      <div className="space-y-6">
        {mockRoles.map(role => (
          <Card key={role.id} className="overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-lg font-bold text-foreground capitalize">
                {role.name.replace(/_/g, ' ')}
              </h3>
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
                      const permissions = role.permissions[group];
                      return (
                        <tr key={group} className="border-b border-border hover:bg-muted/50">
                          <td className="px-4 py-3 font-medium capitalize text-foreground">{group}</td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('create') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('read') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('update') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('delete') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('approve') && <Checkbox checked disabled className="mx-auto" />}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {permissions.includes('reject') && <Checkbox checked disabled className="mx-auto" />}
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
