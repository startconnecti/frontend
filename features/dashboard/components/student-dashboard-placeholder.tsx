'use client';

import Link from 'next/link';
import { User as UserIcon, Search, LogIn, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { PageContainer, ClientStatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';

export function StudentDashboardPlaceholder() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <PageContainer className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#2C1208' }}>
              Student Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your learning journey and sessions.
            </p>
          </div>
          {isAuthenticated && (
            <Badge variant="secondary" className="w-fit h-7 bg-primary/5 text-primary border-none font-bold px-3">
              Student Account
            </Badge>
          )}
        </div>

        <Card className="border-border/60 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Authentication State</CardTitle>
            <CardDescription>Verify your current mock session status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAuthenticated ? (
              <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <LogIn className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">No Active Session</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You are viewing the student dashboard placeholder without an active mock session.
                  </p>
                </div>
                <Button asChild>
                  <Link href={ROUTES.LOGIN}>Sign In to Verify</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{user?.fullName}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <ClientStatusBadge type="user" status={user?.status || 'active'} />
                      <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border/40 space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Session Security
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Mock token is currently held in memory. Route guards are not yet enforced.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border/40 space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <Search className="h-4 w-4 text-primary" />
                      Next Steps
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Browse the marketplace to find expert tutors for your subjects.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href={ROUTES.DISCOVER}>Find Tutors</Link>
          </Button>
          {!isAuthenticated && (
            <Button asChild>
              <Link href={ROUTES.LOGIN}>Go to Login</Link>
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
