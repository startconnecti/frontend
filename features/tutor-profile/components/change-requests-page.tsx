'use client';

import { PageContainer, SectionHeader } from '@/components/shared';
import { useTutorProfileChangeRequestsQuery, useCancelTutorProfileChangeRequestMutation } from '../hooks/use-tutor-profile-change-requests';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, FileText, Ban, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function ChangeRequestsPage() {
  const { data, isLoading, isError, refetch } = useTutorProfileChangeRequestsQuery({ limit: 50 });
  const cancelMutation = useCancelTutorProfileChangeRequestMutation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success('Change request cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel change request');
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 uppercase text-[10px] font-black tracking-wider flex items-center gap-1.5" variant="outline">
            <CheckCircle2 className="h-3 w-3 stroke-[2.5]" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 px-3 py-1 uppercase text-[10px] font-black tracking-wider flex items-center gap-1.5" variant="outline">
            <XCircle className="h-3 w-3 stroke-[2.5]" /> Rejected
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 px-3 py-1 uppercase text-[10px] font-black tracking-wider flex items-center gap-1.5" variant="outline">
            <Ban className="h-3 w-3 stroke-[2.5]" /> Cancelled
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 uppercase text-[10px] font-black tracking-wider flex items-center gap-1.5" variant="outline">
            <Clock className="h-3 w-3 stroke-[2.5]" /> Pending
          </Badge>
        );
    }
  };

  return (
    <PageContainer className="py-8 space-y-10 max-w-4xl">
      <div className="space-y-4">
        <Link href="/settings/tutor-profile" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>
        <SectionHeader 
          title="Change Requests"
          description="View and manage the history of your profile updates."
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <Card className="border-border/60 bg-rose-50 border-rose-100 rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900">Failed to load requests</h3>
              <p className="text-sm text-rose-700">There was an error loading your change request history.</p>
            </div>
            <Button variant="outline" className="bg-white border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : !data?.items || data.items.length === 0 ? (
        <Card className="border-border/60 rounded-3xl bg-muted/5 border-dashed">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-muted/10 rounded-full flex items-center justify-center mb-2">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-brand-dark">No Change Requests</h3>
              <p className="text-sm text-muted-foreground">You haven't submitted any profile change requests yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data.items.map((request) => (
            <Card key={request.id} className="border-border/60 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/5 border-b border-border/40 p-6 flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base font-black flex items-center gap-2">
                    Profile Snapshot Update
                    {renderStatusBadge(request.status)}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium">
                    Requested on {new Date(request.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/settings/tutor-profile/change-requests/${request.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {request.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handleCancel(request.id)}
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="bg-white border border-border/40 rounded-xl p-5 mb-4 shadow-sm">
                      <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Snapshot Payload
                      </h4>
                    
                    {(() => {
                      // Defensive mapping for backward compatibility and null safety
                      const profile = request.changePayload?.profile || (request.changePayload as any); // Fallback to root payload for legacy
                      const subjectIds = Array.isArray(request.changePayload?.subject_ids) ? request.changePayload.subject_ids : [];
                      const certifications = Array.isArray(request.changePayload?.certifications) ? request.changePayload.certifications : [];
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="font-bold text-brand-dark mb-1">Profile Info</p>
                            <ul className="list-disc list-inside space-y-1 ml-1 text-xs">
                              {profile?.hourly_rate !== undefined && profile?.hourly_rate !== null && <li>Hourly Rate: ${profile.hourly_rate}</li>}
                              {profile?.years_of_experience !== undefined && profile?.years_of_experience !== null && <li>Experience: {profile.years_of_experience} years</li>}
                              {profile?.bio && <li>Bio updated</li>}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="font-bold text-brand-dark mb-1">Subjects</p>
                            <p className="text-xs ml-1">{subjectIds.length} subjects assigned</p>
                          </div>

                          {certifications.length > 0 && (
                            <div>
                              <p className="font-bold text-brand-dark mb-1">Certifications</p>
                              <p className="text-xs ml-1">{certifications.length} certificates included</p>
                              <ul className="list-disc list-inside space-y-1 ml-1 mt-1 text-xs">
                                {certifications.map((cert: import('../types').TutorProfileSnapshotCertification, i: number) => (
                                  <li key={i}>{cert.name} ({cert.issuer}) {cert.tempFileKey && <span className="text-emerald-600 font-medium ml-1">New Upload</span>} {!cert.id && !cert.tempFileKey && <span className="text-blue-600 font-medium ml-1">New Draft</span>}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    </div>
                  </div>

                  {request.requestNote && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                      <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">My Note</p>
                        <p className="text-sm text-blue-700">{request.requestNote}</p>
                      </div>
                    </div>
                  )}
                  
                  {request.adminNote && request.status === 'rejected' && (
                    <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3">
                      <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">Admin Feedback</p>
                        <p className="text-sm text-rose-700">{request.adminNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
