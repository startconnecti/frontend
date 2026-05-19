'use client';

import { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfileSettingsQuery } from '../hooks/use-profile-settings-query';
import { useUploadAvatarMutation } from '../hooks/use-upload-avatar-mutation';
import { ProfileSettingsForm } from './profile-settings-form';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ProfileSettingsPage() {
  const { data: profile, isLoading, isError } = useProfileSettingsQuery();
  const uploadMutation = useUploadAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PNG, JPEG, and WebP images are allowed.');
        return;
      }

      // Create local preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Perform upload
      uploadMutation.mutate(file, {
        onError: () => {
          setPreviewUrl(null);
        },
      });
    }
  };

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
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Account Summary Card */}
      <Card className="border-border/60 bg-primary/5 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div 
              className="relative group cursor-pointer select-none shrink-0"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-20 w-20 border-4 border-white shadow-md transition-opacity group-hover:opacity-90">
                <AvatarImage src={previewUrl || profile.avatarUrl} alt={profile.fullName} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-brand-dark">{profile.fullName}</h3>
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
          <h4 className="text-lg font-bold text-brand-dark">Personal Information</h4>
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
