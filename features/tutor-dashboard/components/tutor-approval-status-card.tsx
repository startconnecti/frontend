'use client';

import { ShieldCheck, ShieldAlert, ShieldX, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TutorApprovalStatus } from '../types';

interface TutorApprovalStatusCardProps {
  status: TutorApprovalStatus;
  isPublic: boolean;
}

export function TutorApprovalStatusCard({ status, isPublic }: TutorApprovalStatusCardProps) {
  const configs = {
    approved: {
      icon: ShieldCheck,
      title: 'Profile Approved',
      description: isPublic 
        ? 'Your profile is live and visible to students.' 
        : 'Your profile is approved but currently hidden.',
      color: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600',
    },
    pending: {
      icon: ShieldAlert,
      title: 'Under Review',
      description: 'The admin team is reviewing your profile. This typically takes 24-48 hours.',
      color: 'bg-amber-50 border-amber-100 text-amber-800',
      iconColor: 'text-amber-600',
    },
    rejected: {
      icon: ShieldX,
      title: 'Action Required',
      description: 'Your profile was not approved. Please check your email for requested changes.',
      color: 'bg-rose-50 border-rose-100 text-rose-800',
      iconColor: 'text-rose-600',
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Card className={`border ${config.color} shadow-sm rounded-2xl overflow-hidden`}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className={`h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${config.iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm">{config.title}</h4>
          <p className="text-xs opacity-90 leading-relaxed">{config.description}</p>
        </div>
        {status === 'approved' && (
          <div className="ml-auto flex flex-col items-end gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isPublic ? 'bg-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
              {isPublic ? 'Public' : 'Hidden'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
