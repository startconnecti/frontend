'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileSettingsQuery } from '../hooks/use-profile-settings-query';
import { ProfileSettingsForm } from './profile-settings-form';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfileSettingsPage() {
  const { data: profile, isLoading, isError } = useProfileSettingsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground">Failed to load profile settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Account Summary Card */}
      <Card className="border-border/60 bg-primary/5 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black" style={{ color: '#2C1208' }}>{profile.fullName}</h3>
              <p className="text-sm text-muted-foreground font-medium">{profile.email}</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                {profile.role}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-1">
          <h4 className="text-lg font-bold" style={{ color: '#2C1208' }}>Personal Information</h4>
          <p className="text-sm text-muted-foreground">Update your personal details and contact information.</p>
        </div>
        
        <Card className="border-border/60 shadow-sm">
          <CardContent className="pt-6">
            <ProfileSettingsForm initialData={profile} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
