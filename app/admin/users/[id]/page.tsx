'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import { AdminConfirmDialog } from '@/components/admin/admin-confirm-dialog';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { ADMIN_ROUTES } from '@/constants/admin-routes';
import {
  useAdminUserDetailQuery,
  useBlockAdminUserMutation,
  useUnblockAdminUserMutation,
} from '@/features/admin-users';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isValid, parseISO } from 'date-fns';

function formatDate(dateString?: string | null, withTime = false) {
  if (!dateString) return '-';
  const date = parseISO(dateString);
  if (!isValid(date)) return '-';
  return format(date, withTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');
}

function getInitials(name?: string, email?: string) {
  const source = name || email || 'Unknown';
  return source.substring(0, 2).toUpperCase();
}

function UserDetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <div className="flex gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-4 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useAdminUserDetailQuery(userId);
  const blockMutation = useBlockAdminUserMutation(userId);
  const unblockMutation = useUnblockAdminUserMutation(userId);

  const isMutating = blockMutation.isPending || unblockMutation.isPending;

  if (isLoading) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4">
          <Link href={ADMIN_ROUTES.USERS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
        </div>
        <UserDetailSkeleton />
      </>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center">
          <p className="text-lg font-medium">
            {isError ? 'Failed to load user' : 'User not found'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isError
              ? 'An error occurred while loading this user. Please try again.'
              : 'This user does not exist or may have been removed.'}
          </p>
          <Link href={ADMIN_ROUTES.USERS}>
            <Button className="mt-4" variant="outline">
              Back to Users
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const phone = user.phoneNumber || user.phone;
  const avatar = user.avatarUrl || user.avatar;
  const dob = user.dateOfBirth;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href={ADMIN_ROUTES.USERS}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Details</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Profile Card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={avatar || undefined} alt={user.fullName} />
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(user.fullName, user.email)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.fullName || 'Unknown User'}
                  </h2>
                  <div className="mt-1 flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize text-xs font-medium px-2 py-0.5">
                    {user.role}
                  </Badge>
                  <AdminStatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Details Card */}
          <Card className="p-6">
            <h3 className="mb-6 text-lg font-bold border-b pb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-sm font-medium">{user.fullName || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm font-medium break-all">{user.email}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-sm font-medium">{phone || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Gender</p>
                <p className="text-sm font-medium capitalize">{user.gender || '-'}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-sm font-medium">{formatDate(dob, false)}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Role</p>
                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <div><AdminStatusBadge status={user.status} /></div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Login</p>
                <p className="text-sm font-medium">{formatDate(user.lastLoginAt, true)}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Created At</p>
                <p className="text-sm font-medium">{formatDate(user.createdAt, true)}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Updated At</p>
                <p className="text-sm font-medium">{formatDate(user.updatedAt, true)}</p>
              </div>
              
              {user.deletedAt && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 text-destructive">Deleted At</p>
                  <p className="text-sm font-medium text-destructive">{formatDate(user.deletedAt, true)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Tutor Profile Section */}
          {user.role === 'tutor' && (
            user.tutorProfileSummary ? (
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b pb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold">Tutor Profile</h3>
                    {(user.tutorProfileSummary.profileStatus || user.tutorProfileSummary.approvalStatus) && (
                      <AdminStatusBadge status={user.tutorProfileSummary.profileStatus || user.tutorProfileSummary.approvalStatus || 'pending'} />
                    )}
                  </div>
                  <Link href={`/admin/tutors/${user.tutorProfileSummary.tutorProfileId || user.tutorProfileSummary.id}`}>
                    <Button variant="outline" size="sm">
                      View Tutor Profile
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Hourly Rate</p>
                    <p className="text-sm font-medium">
                      {user.tutorProfileSummary.hourlyRate != null 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.tutorProfileSummary.hourlyRate)
                        : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Subjects</p>
                    {user.tutorProfileSummary.subjects && user.tutorProfileSummary.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.tutorProfileSummary.subjects.map(subject => (
                          <Badge key={subject.id} variant="secondary">{subject.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">-</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Profile Created</p>
                    <p className="text-sm font-medium">{formatDate(user.tutorProfileSummary.createdAt, true)}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Profile Updated</p>
                    <p className="text-sm font-medium">{formatDate(user.tutorProfileSummary.updatedAt, true)}</p>
                  </div>
                </div>

                <div className="space-y-6 mt-6 border-t pt-6">
                  {user.tutorProfileSummary.bio && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{user.tutorProfileSummary.bio}</p>
                    </div>
                  )}

                  {user.tutorProfileSummary.experienceText && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Experience</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{user.tutorProfileSummary.experienceText}</p>
                    </div>
                  )}

                  {user.tutorProfileSummary.approvalNote && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Approval Note</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{user.tutorProfileSummary.approvalNote}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t pt-6">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Certifications</p>
                  {user.tutorProfileSummary.certifications && user.tutorProfileSummary.certifications.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.tutorProfileSummary.certifications.map((cert, idx) => (
                        <div key={cert.id || idx} className="rounded-md border p-4 text-sm bg-card">
                          <p className="font-semibold text-foreground">{cert.name || '-'}</p>
                          {cert.issuer && <p className="text-muted-foreground text-xs mt-1">{cert.issuer}</p>}
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{formatDate(cert.uploadedAt)}</span>
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                View File
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No certifications uploaded.</p>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-dashed bg-muted/20">
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <h3 className="text-lg font-bold mb-2">Tutor Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    This user is a tutor but has not created a tutor profile yet.
                  </p>
                </div>
              </Card>
            )
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          {user.status === 'active' && (
            <AdminConfirmDialog
              title="Block User?"
              description="The user will not be able to access their account. They can contact support to restore access."
              actionLabel="Block User"
              actionVariant="destructive"
              triggerLabel={isMutating ? 'Processing…' : 'Block User'}
              triggerVariant="destructive"
              onConfirm={() => blockMutation.mutate()}
            />
          )}

          {user.status === 'blocked' && (
            <AdminConfirmDialog
              title="Unblock User?"
              description="The user will regain access to their account immediately."
              actionLabel="Unblock User"
              actionVariant="default"
              triggerLabel={isMutating ? 'Processing…' : 'Unblock User'}
              triggerVariant="outline"
              onConfirm={() => unblockMutation.mutate()}
            />
          )}

          <Card className="p-6 bg-muted/50 border-dashed">
            <h4 className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Account ID</h4>
            <p className="font-mono text-xs text-foreground break-all">{user.id}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
