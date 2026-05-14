'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { useAdminTutorDetailQuery } from '@/features/admin-tutors';

export default function EditTutorPage() {
  const params = useParams();
  const tutorId = params.id as string;

  const {
    data: tutor,
    isLoading,
    isError,
  } = useAdminTutorDetailQuery(tutorId);

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/tutors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Tutor</h1>
        </div>
        <Card className="p-6 max-w-2xl">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </>
    );
  }

  if (isError || !tutor) {
    return <AdminRecordNotFound backHref="/admin/tutors" />;
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/tutors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Tutor</h1>
      </div>

      <Card className="p-6 max-w-2xl">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={tutor.fullName || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={tutor.email || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" defaultValue={tutor.bio || ''} className="min-h-32" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input id="hourlyRate" type="number" defaultValue={tutor.hourlyRate || 0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input id="experience" defaultValue={tutor.experienceText || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input id="subjects" defaultValue={(tutor.subjects || []).map(s => s.name).join(', ')} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-primary text-primary-foreground">
              Save Changes
            </Button>
            <Link href={`/admin/tutors/${tutorId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </>
  );
}
