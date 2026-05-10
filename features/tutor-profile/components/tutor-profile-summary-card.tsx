'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, ExternalLink, Globe, Lock } from 'lucide-react';
import { TutorProfile } from '../types';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

interface TutorProfileSummaryCardProps {
  profile: TutorProfile;
}

export function TutorProfileSummaryCard({ profile }: TutorProfileSummaryCardProps) {
  return (
    <Card className="border-border/60 bg-white shadow-xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              variant="secondary" 
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full shadow-lg border-4 border-white opacity-0 group-hover:opacity-100 transition-opacity"
              disabled
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h3 className="text-3xl font-black" style={{ color: '#2C1208' }}>{profile.fullName}</h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  profile.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {profile.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {profile.isPublic ? 'Publicly Visible' : 'Hidden'}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Professional Tutor • {profile.yearsOfExperience} years experience</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button variant="outline" size="sm" className="font-bold gap-2" asChild>
                <Link href={ROUTES.TUTOR_DETAIL(profile.id)} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Preview Public Profile
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Hourly Rate</p>
              <p className="text-4xl font-black text-primary">${profile.hourlyRate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
