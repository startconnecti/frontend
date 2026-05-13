'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronLeftIcon, SaveIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import { useAdminUserDetailQuery } from '@/features/admin-users';
import { toast } from 'sonner';

export default function UserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: user, isLoading } = useAdminUserDetailQuery(id as string);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role || '',
        status: user.status || ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('User update API call placeholder', {
      description: `This would call PATCH /api/v1/admin/users/${id} in production.`
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.USERS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Edit User Account"
        description={`Update account details and role for ${user?.fullName || 'User'}`}
      />

      <div className="max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button variant="outline" type="button" asChild>
                <Link href={ADMIN_ROUTES.USER_DETAIL(id as string)}>Cancel</Link>
              </Button>
              <Button type="submit" className="gap-2">
                <SaveIcon className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
