'use client';

import { PageContainer, SectionHeader } from '@/components/shared';
import { useTutorProfileChangeRequestDetailQuery, useCancelTutorProfileChangeRequestMutation } from '../hooks/use-tutor-profile-change-requests';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, XCircle, Ban, AlertCircle, ArrowLeft, FileText, ExternalLink, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ChangeRequestDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: request, isLoading, isError } = useTutorProfileChangeRequestDetailQuery(id);
  const cancelMutation = useCancelTutorProfileChangeRequestMutation();

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this pending request?")) return;
    try {
      await cancelMutation.mutateAsync(id);
      toast.success('Change request cancelled successfully');
      router.push('/settings/tutor-profile/change-requests');
    } catch (err) {
      toast.error('Failed to cancel change request');
    }
  };

  const handleEdit = () => {
    router.push(`/settings/tutor-profile/change-requests/${id}/edit`);
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

  const isInvalidId = !id || id === 'undefined';

  if (isInvalidId) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Card className="border-border/60 bg-amber-50 border-amber-100 rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-900">Invalid Request Link</h3>
              <p className="text-sm text-amber-700">The link you followed is broken or incomplete.</p>
            </div>
            <Button variant="outline" className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => router.push('/settings/tutor-profile/change-requests')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Skeleton className="h-64 w-full rounded-2xl" />
      </PageContainer>
    );
  }

  if (isError || !request) {
    return (
      <PageContainer className="py-8 space-y-10 max-w-4xl">
        <Card className="border-border/60 bg-rose-50 border-rose-100 rounded-3xl">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <div className="space-y-1">
              <h3 className="font-bold text-rose-900">Request Not Found</h3>
              <p className="text-sm text-rose-700">Unable to load the requested detail page.</p>
            </div>
            <Button variant="outline" className="bg-white border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => router.push('/settings/tutor-profile/change-requests')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const payload = request.changePayload || (request as any).change_payload || {};
  const profile = payload.profile || {};
  const subjectsSnapshot = Array.isArray(payload.subjects) ? payload.subjects : [];
  const subjectIds = Array.isArray(payload.subject_ids) ? payload.subject_ids : [];
  const certifications = Array.isArray(payload.certifications) ? payload.certifications : [];

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <Link href="/settings/tutor-profile/change-requests" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Change Requests
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SectionHeader 
            title="Request Detail"
            description={`ID: ${request.id} • Submitted on ${new Date(request.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`}
          />
          <div className="flex items-center gap-3">
            {renderStatusBadge(request.status)}
            {request.status === 'pending' && (
              <>
                <Button 
                  variant="outline"
                  onClick={handleEdit}
                  className="bg-white"
                >
                  Edit Request
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  Cancel Request
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {(request.requestNote || request.adminNote) && (
          <Card className="border-border/60 shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/5 border-b border-border/40 pb-4">
              <CardTitle className="text-base font-black">Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {request.requestNote && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                  <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">My Note</p>
                    <p className="text-sm text-blue-700">{request.requestNote}</p>
                  </div>
                </div>
              )}
              {request.adminNote && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
                      Admin Feedback {request.reviewedAt ? `(${new Date(request.reviewedAt).toLocaleDateString()})` : ''}
                    </p>
                    <p className="text-sm text-rose-700">{request.adminNote}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/5 border-b border-border/40">
            <CardTitle className="text-base font-black">Immutable Snapshot</CardTitle>
            <CardDescription>This is exactly what you submitted.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Profile Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/5 border rounded-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Hourly Rate</p>
                  <p className="font-medium text-base">
                    {(typeof profile.hourly_rate === 'number' && !isNaN(profile.hourly_rate)) || (typeof profile.hourlyRate === 'number' && !isNaN(profile.hourlyRate))
                      ? `${(profile.hourly_rate ?? profile.hourlyRate ?? 0).toLocaleString()} VND / hr`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="bg-muted/5 border rounded-lg p-4">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Years of Experience</p>
                  <p className="font-medium text-base">
                    {(typeof profile.years_of_experience === 'number' && !isNaN(profile.years_of_experience)) || (typeof profile.yearsOfExperience === 'number' && !isNaN(profile.yearsOfExperience))
                      ? `${profile.years_of_experience ?? profile.yearsOfExperience} years`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="bg-muted/5 border rounded-lg p-4 md:col-span-2">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Bio</p>
                  <p className="font-medium text-sm whitespace-pre-wrap leading-relaxed">{profile.bio || 'Not specified'}</p>
                </div>
                <div className="bg-muted/5 border rounded-lg p-4 md:col-span-2">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Experience Description</p>
                  <p className="font-medium text-sm whitespace-pre-wrap leading-relaxed">{profile.experience_text ?? profile.experienceText ?? 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Subjects</h4>
              {subjectsSnapshot.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subjectsSnapshot.map((subject: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                      {subject.name ?? subject.id}
                    </Badge>
                  ))}
                </div>
              ) : subjectIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subjectIds.map((subjectId: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="px-4 py-1.5 text-sm font-medium text-muted-foreground">
                      Subject ID: {subjectId}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">No subjects requested.</div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Certifications</h4>
              {certifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert: any, idx: number) => {
                    const rawCertUrl = cert.fileUrl ?? cert.certificateUrl ?? cert.url ?? null;
                    
                    let absoluteUrl = null;
                    if (rawCertUrl) {
                      absoluteUrl = rawCertUrl.startsWith('http')
                        ? rawCertUrl
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}${rawCertUrl}`;
                    }

                    const isPdf = absoluteUrl?.toLowerCase().endsWith('.pdf');

                    return (
                      <div key={idx} className="border rounded-xl p-5 space-y-3 relative overflow-hidden bg-white shadow-sm">
                        {cert.id ? (
                          <Badge className="absolute top-4 right-4 bg-blue-50 text-blue-700 border-blue-200" variant="outline">
                            Update Existing
                          </Badge>
                        ) : (
                          <Badge className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">
                            New Certificate
                          </Badge>
                        )}
                        <div className="font-bold text-lg pr-28 text-brand-dark">{cert.name || 'Unnamed Certificate'}</div>
                        
                        <div className="space-y-1">
                          {cert.issuer && <div className="text-sm font-medium text-muted-foreground flex items-center gap-2"><span className="w-16">Issuer:</span> <span className="text-foreground">{cert.issuer}</span></div>}
                          {cert.issuedAt && <div className="text-sm font-medium text-muted-foreground flex items-center gap-2"><span className="w-16">Issued:</span> <span className="text-foreground">{cert.issuedAt}</span></div>}
                        </div>
                        
                        {absoluteUrl ? (
                          <div className="pt-4 mt-4 border-t border-border/60">
                            {isPdf ? (
                              <Link 
                                href={absoluteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 p-3 rounded-lg w-full justify-center"
                              >
                                <FileText className="w-5 h-5" />
                                Open PDF Certificate
                                <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                              </Link>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground gap-2">
                                  <ImageIcon className="w-4 h-4" />
                                  Image Preview
                                </div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={absoluteUrl} 
                                  alt={cert.name || 'Certificate'} 
                                  className="max-h-56 rounded-lg object-contain border bg-muted/10 w-full" 
                                  loading="lazy"
                                />
                                <div className="text-right">
                                  <Link 
                                    href={absoluteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                  >
                                    View full size
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="pt-3 mt-3 border-t text-sm text-muted-foreground italic flex items-center gap-2">
                            <FileText className="w-4 h-4 opacity-50" />
                            No document attached
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">No certifications requested.</div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
