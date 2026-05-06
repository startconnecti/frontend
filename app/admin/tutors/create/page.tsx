'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateTutorPage() {
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/tutors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create Tutor</h1>
      </div>

      <Card className="p-6 max-w-2xl">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Tutor full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Tutor email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Tutor biography" className="min-h-32" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input id="hourlyRate" type="number" placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" placeholder="5" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input id="subjects" placeholder="Mathematics, Physics, Chemistry" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-primary text-primary-foreground">
              Create Tutor
            </Button>
            <Link href="/admin/tutors">
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
