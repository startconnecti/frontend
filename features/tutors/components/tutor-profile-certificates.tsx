'use client';

import { Award, FileText, ExternalLink, ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Certificate } from '../types';

interface TutorProfileCertificatesProps {
  certificates: Certificate[];
}

function resolveAbsoluteUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  return rawUrl.startsWith('http')
    ? rawUrl
    : `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${rawUrl}`;
}

export function TutorProfileCertificates({ certificates }: TutorProfileCertificatesProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight" style={{ color: '#2C1208' }}>Certificates &amp; Education</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => {
          const absoluteUrl = resolveAbsoluteUrl(cert.fileUrl);
          const isPdf = absoluteUrl?.toLowerCase().endsWith('.pdf') ?? false;

          return (
            <Card key={cert.id} className="p-4 flex flex-col gap-3 border-border/40 hover:border-primary/20 transition-colors rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{cert.title}</h4>
                  <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {cert.year > 0 ? cert.year : ''}
                      {cert.expiryDate ? ` · Expires ${cert.expiryDate}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {absoluteUrl && (
                <div className="border-t border-border/40 pt-3">
                  {isPdf ? (
                    <Link
                      href={absoluteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 transition-colors p-2.5 rounded-lg w-full justify-center"
                    >
                      <FileText className="h-4 w-4" />
                      View Certificate (PDF)
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span className="font-medium">Preview</span>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={absoluteUrl}
                        alt={cert.title || 'Certificate'}
                        className="max-h-40 rounded-lg object-contain border bg-muted/10 w-full"
                        loading="lazy"
                      />
                      <div className="text-right">
                        <Link
                          href={absoluteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                        >
                          View full size
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
