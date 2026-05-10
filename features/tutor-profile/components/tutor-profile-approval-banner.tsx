'use client';

import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApprovalStatus } from '../types';

interface TutorProfileApprovalBannerProps {
  status: ApprovalStatus;
  reviewNote?: string;
}

export function TutorProfileApprovalBanner({ status, reviewNote }: TutorProfileApprovalBannerProps) {
  if (status === 'approved') {
    return (
      <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 rounded-2xl">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="font-black text-xs uppercase tracking-widest">Profile Approved</AlertTitle>
        <AlertDescription className="text-sm font-medium">
          Your profile is currently public. Note that critical changes to your bio, subjects, or rate may require a new admin review.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'pending') {
    return (
      <Alert className="bg-amber-50 border-amber-200 text-amber-800 rounded-2xl">
        <Clock className="h-4 w-4 text-amber-600" />
        <AlertTitle className="font-black text-xs uppercase tracking-widest">Under Review</AlertTitle>
        <AlertDescription className="text-sm font-medium">
          Our team is currently reviewing your profile. You can still update your information, but changes will be reflected once approved.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'rejected') {
    return (
      <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-800 rounded-2xl">
        <XCircle className="h-4 w-4 text-rose-600" />
        <AlertTitle className="font-black text-xs uppercase tracking-widest">Action Required</AlertTitle>
        <AlertDescription className="text-sm font-medium space-y-2">
          <p>Your profile was not approved for the following reason:</p>
          <div className="p-3 bg-white/50 rounded-xl border border-rose-100 italic">
            "{reviewNote || 'Incomplete profile information or invalid certificates.'}"
          </div>
          <p>Please update your profile based on the feedback and resubmit for review.</p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
