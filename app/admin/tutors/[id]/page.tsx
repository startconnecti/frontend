'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Award, Users } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { AdminRecordNotFound } from '@/components/admin/admin-record-not-found';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getTutorById } from '@/lib/admin/mock-data';

interface PageProps {
  params: {
    id: string;
  };
}

export default function TutorDetailPage({ params }: PageProps) {
  const tutor = getTutorById(params.id);
  
  if (!tutor) {
    return <AdminRecordNotFound backHref="/admin/tutors" />;
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/tutors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tutor Details</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{tutor.name}</h2>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{tutor.email}</span>
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{tutor.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <AdminStatusBadge status={tutor.approvalStatus} />
            </div>
          </Card>

          {/* Bio */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Bio</h3>
            <p className="text-sm text-foreground leading-relaxed">{tutor.bio}</p>
          </Card>

          {/* Expertise */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Expertise</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(subject => (
                    <Badge key={subject} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  <p className="text-lg font-bold text-foreground">${tutor.hourlyRate}/hr</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-lg font-bold text-foreground">{tutor.experience} years</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-bold">Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold text-foreground">{tutor.rating} ⭐</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold text-foreground">{tutor.totalSessions}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-lg font-bold text-foreground">{tutor.status}</p>
              </div>
            </div>
          </Card>

          {/* Certificates */}
          {tutor.certificates.length > 0 && (
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-bold">Certificates</h3>
              <div className="space-y-3">
                {tutor.certificates.map(cert => (
                  <div key={cert.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <Award className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground mt-1">Uploaded: {cert.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar - Admin Actions */}
        <div className="space-y-4">
          {tutor.approvalStatus === 'pending' && (
            <>
              <Card className="p-6">
                <h3 className="mb-4 font-bold text-foreground">Approve Application?</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  This will send an approval notification to the tutor.
                </p>
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                  Approve Tutor
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4 font-bold text-foreground">Reject Application?</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Provide a reason for rejection.
                </p>
                {!showRejectionForm ? (
                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setShowRejectionForm(true)}
                  >
                    Reject Tutor
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowRejectionForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          setShowRejectionForm(false);
                          setRejectionReason('');
                        }}
                      >
                        Confirm Reject
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </>
          )}

          {tutor.approvalStatus === 'approved' && (
            <Card className="p-6">
              <h3 className="mb-4 font-bold text-foreground">Account Active</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                This tutor is approved and active on the platform.
              </p>
              <AdminConfirmDialog
                title="Suspend Tutor?"
                description="This will prevent the tutor from taking new bookings."
                actionLabel="Suspend"
                actionVariant="destructive"
                triggerLabel="Suspend Tutor"
                triggerVariant="destructive"
                onConfirm={() => console.log('Suspended')}
              />
            </Card>
          )}

          <Card className="p-6 bg-muted/50">
            <h4 className="mb-2 text-sm font-bold text-foreground">Submission Info</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Submitted: {tutor.submittedAt}</p>
              {tutor.approvedAt && <p>Approved: {tutor.approvedAt}</p>}
              {tutor.rejectionReason && <p>Reason: {tutor.rejectionReason}</p>}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
