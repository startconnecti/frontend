'use client';

import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { LoginForm } from './login-form';

export function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your Connecti account to continue.
        </p>
      </div>

      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardContent className="pt-8">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-8 border-t bg-muted/10 pt-6">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
              Create one now
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Helper credentials for testing */}
      <div className="p-4 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Test Credentials
        </div>
        <div className="grid grid-cols-2 gap-4 text-[10px]">
          <div>
            <p className="font-semibold text-foreground">Student</p>
            <p className="text-muted-foreground">student@example.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Tutor (Approved)</p>
            <p className="text-muted-foreground">tutor@example.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Tutor (Pending)</p>
            <p className="text-muted-foreground">pending@example.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
          <div>
            <p className="font-semibold text-foreground text-destructive">Blocked User</p>
            <p className="text-muted-foreground">blocked@example.com</p>
            <p className="text-muted-foreground">password123</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" asChild>
          <Link href={ROUTES.DISCOVER}>
            <ArrowLeft className="h-4 w-4" />
            Back to Tutors
          </Link>
        </Button>
      </div>
    </div>
  );
}
