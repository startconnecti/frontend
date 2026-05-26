import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useAdminSubjectsQuery } from '@/features/admin-subjects';
import { useMemo } from 'react';

interface SnapshotRendererProps {
  payload: any;
}

export function SnapshotRenderer({ payload }: SnapshotRendererProps) {
  // Fetch subjects to map UUIDs to Names
  const { data: subjectsData } = useAdminSubjectsQuery({ limit: 1000 });

  const subjectMap = useMemo(() => {
    const map = new Map<string, string>();
    if (subjectsData?.items) {
      subjectsData.items.forEach((subject) => {
        map.set(subject.id, subject.name);
      });
    }
    return map;
  }, [subjectsData]);

  if (!payload || typeof payload !== 'object') {
    return (
      <div className="text-muted-foreground italic">
        No valid snapshot payload found.
      </div>
    );
  }

  const profile = payload.profile || {};
  const subjects = Array.isArray(payload.subject_ids) ? payload.subject_ids : [];
  const certifications = Array.isArray(payload.certifications) ? payload.certifications : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Hourly Rate</h4>
            <div className="text-base font-medium">
              {typeof profile.hourly_rate === 'number' && !isNaN(profile.hourly_rate) 
                ? `${profile.hourly_rate.toLocaleString()} VND / hr` 
                : 'Not specified'}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Years of Experience</h4>
            <div className="text-base font-medium">
              {typeof profile.years_of_experience === 'number' && !isNaN(profile.years_of_experience)
                ? `${profile.years_of_experience} years`
                : 'Not specified'}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
            <div className="text-base whitespace-pre-wrap">
              {profile.bio || 'Not specified'}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Experience Description</h4>
            <div className="text-base whitespace-pre-wrap">
              {profile.experience_text || 'Not specified'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requested Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subjects.map((subjectId: string, idx: number) => {
                const subjectName = subjectMap.get(subjectId);
                return (
                  <Badge key={idx} variant="secondary">
                    {subjectName ?? subjectId}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground italic">No subjects requested.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requested Certifications</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <div key={idx} className="border rounded-lg p-4 space-y-2 relative overflow-hidden">
                    {cert.id ? (
                      <Badge className="absolute top-4 right-4" variant="outline">
                        Update Existing
                      </Badge>
                    ) : (
                      <Badge className="absolute top-4 right-4" variant="default">
                        New Certificate
                      </Badge>
                    )}
                    <div className="font-semibold pr-24">{cert.name || 'Unnamed Certificate'}</div>
                    {cert.issuer && <div className="text-sm text-muted-foreground">Issuer: {cert.issuer}</div>}
                    {cert.issuedAt && <div className="text-sm text-muted-foreground">Issued: {cert.issuedAt}</div>}
                    
                    {absoluteUrl ? (
                      <div className="pt-4 mt-4 border-t">
                        {isPdf ? (
                          <Link 
                            href={absoluteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-primary/5 p-3 rounded-md w-full justify-center"
                          >
                            <FileText className="w-5 h-5" />
                            Open PDF Certificate
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </Link>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground gap-2 mb-2">
                              <ImageIcon className="w-4 h-4" />
                              Image Preview
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={absoluteUrl} 
                              alt={cert.name || 'Certificate'} 
                              className="max-h-48 rounded-md object-contain border bg-muted/20 w-full" 
                              loading="lazy"
                            />
                            <div className="text-right">
                              <Link 
                                href={absoluteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                View full size
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 text-sm text-muted-foreground italic flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        No document attached
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground italic">No certifications requested.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
