'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { RegisterCredentialsForm, RegisterFormValues } from './register-credentials-form';
import { RegisterOtpForm } from './register-otp-form';

type RegisterStep = 'credentials' | 'otp';

export function RegisterPage() {
  const [step, setStep] = useState<RegisterStep>('credentials');
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);

  const handleCredentialsSuccess = (values: RegisterFormValues) => {
    setFormData(values);
    setStep('otp');
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#2C1208' }}>
          {step === 'credentials' ? 'Join Connecti' : 'Check your email'}
        </h1>
        <p className="text-muted-foreground">
          {step === 'credentials' 
            ? 'Start your learning or teaching journey today.' 
            : 'Enter the verification code we sent to your inbox.'}
        </p>
      </div>

      <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-3xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'credentials' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <CardTitle className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Step {step === 'credentials' ? '1' : '2'} of 2
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {step === 'credentials' ? (
            <RegisterCredentialsForm onSuccess={handleCredentialsSuccess} />
          ) : (
            <RegisterOtpForm 
              email={formData?.email || ''} 
              role={formData?.role || 'student'} 
              onBack={handleBackToCredentials} 
            />
          )}
        </CardContent>
        {step === 'credentials' && (
          <CardFooter className="flex flex-col gap-4 pb-8 border-t bg-muted/10 pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>

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
