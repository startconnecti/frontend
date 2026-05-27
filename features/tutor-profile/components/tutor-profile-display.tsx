'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, GraduationCap, Clock, DollarSign, FileText, ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TutorProfile, TutorCertificate } from '../types';

interface TutorProfileDisplayProps {
  profile: TutorProfile;
}

function resolveAbsoluteUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  return rawUrl.startsWith('http')
    ? rawUrl
    : `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${rawUrl}`;
}

function CertificationCard({ cert }: { cert: TutorCertificate }) {
  const rawUrl = cert.fileUrl ?? cert.certificateUrl ?? null;
  const absoluteUrl = resolveAbsoluteUrl(rawUrl);
  const isPdf = absoluteUrl?.toLowerCase().endsWith('.pdf') ?? false;

  return (
    <div className="border rounded-xl p-5 space-y-3 bg-white shadow-sm relative overflow-hidden">
      <div className="font-bold text-base text-brand-dark">{cert.title || 'Unnamed Certificate'}</div>

      <div className="space-y-1">
        {cert.organization && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium w-16 shrink-0">Issuer:</span>
            <span className="text-foreground">{cert.organization}</span>
          </div>
        )}
        {cert.year > 0 && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium w-16 shrink-0">Issued:</span>
            <span className="text-foreground">{cert.year}</span>
          </div>
        )}
        {cert.expiryDate && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium w-16 shrink-0">Expires:</span>
            <span className="text-foreground">{cert.expiryDate}</span>
          </div>
        )}
      </div>

      {absoluteUrl ? (
        <div className="pt-3 mt-3 border-t border-border/60">
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
                alt={cert.title || 'Certificate'}
                className="max-h-52 rounded-lg object-contain border bg-muted/10 w-full"
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
}

export function TutorProfileDisplay({ profile }: TutorProfileDisplayProps) {
  const subjects = Array.isArray(profile.subjects) ? profile.subjects : [];
  const certificates = Array.isArray(profile.certificates) ? profile.certificates : [];

  return (
    <div className="space-y-8">
      {/* Professional Overview — includes rate, experience, subjects, bio, experience text */}
      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <Info className="h-5 w-5 text-primary" />
            Professional Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Hourly Rate
              </p>
              <p className="text-xl font-black text-brand-dark">
                {profile.hourlyRate > 0 ? `${profile.hourlyRate.toLocaleString()} VND / hr` : 'Not specified'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> Years of Experience
              </p>
              <p className="text-xl font-black text-brand-dark">
                {profile.yearsOfExperience > 0 ? `${profile.yearsOfExperience} Years` : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Subjects — inside Professional Overview */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subjects</p>
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject: unknown, idx: number) => {
                  const name = typeof subject === 'string'
                    ? subject
                    : typeof subject === 'object' && subject !== null && 'name' in subject
                      ? (subject as { name: string }).name
                      : '';
                  const key = typeof subject === 'string'
                    ? subject
                    : typeof subject === 'object' && subject !== null && 'id' in subject
                      ? (subject as { id: string }).id
                      : String(idx);
                  return name ? (
                    <Badge key={key} variant="secondary" className="px-4 py-2 text-xs font-bold rounded-xl">
                      {name}
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No subjects added.</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Bio</p>
            <p className="text-sm text-brand-dark/80 whitespace-pre-wrap bg-muted/5 p-4 rounded-xl border border-border/40">
              {profile.bio || 'No bio provided.'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teaching Experience &amp; Approach</p>
            <p className="text-sm text-brand-dark/80 whitespace-pre-wrap bg-muted/5 p-4 rounded-xl border border-border/40">
              {profile.experienceText || 'No experience details provided.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Certifications & Qualifications */}
      <Card className="border-border/60 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-muted/10 border-b border-border/40 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2" style={{ color: '#2C1208' }}>
            <GraduationCap className="h-5 w-5 text-primary" />
            Certifications &amp; Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <CertificationCard key={cert.id || cert.title} cert={cert} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No certifications added.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
