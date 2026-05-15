'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { ForgotPasswordRequestForm } from './forgot-password-request-form';
import { ForgotPasswordOtpForm } from './forgot-password-otp-form';
import { ResetPasswordForm } from './reset-password-form';

type ForgotPasswordStep = 'request' | 'otp' | 'reset';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleRequestSuccess = (requestedEmail: string) => {
    setEmail(requestedEmail);
    setStep('otp');
  };

  const handleOtpSuccess = (verifiedOtp: string) => {
    setOtp(verifiedOtp);
    setStep('reset');
  };

  const handleBackToRequest = () => {
    setStep('request');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#2C1208' }}>
          {step === 'request' && 'Forgot Password'}
          {step === 'otp' && 'Verify Identity'}
          {step === 'reset' && 'Create New Password'}
        </h1>
        <p className="text-muted-foreground">
          {step === 'request' && 'No worries, we will help you get back in.'}
          {step === 'otp' && 'Enter the reset code we sent to your email.'}
          {step === 'reset' && 'Choose a strong password to protect your account.'}
        </p>
      </div>

      <Card className="border-border/60 shadow-xl shadow-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'request' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'otp' ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-12 rounded-full transition-colors ${step === 'reset' ? 'bg-primary' : 'bg-muted'}`} />
          </div>
          <CardTitle className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Step {step === 'request' ? '1' : step === 'otp' ? '2' : '3'} of 3
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-8">
          {step === 'request' && <ForgotPasswordRequestForm onSuccess={handleRequestSuccess} />}
          {step === 'otp' && <ForgotPasswordOtpForm email={email} onSuccess={handleOtpSuccess} onBack={handleBackToRequest} />}
          {step === 'reset' && <ResetPasswordForm email={email} otp={otp} />}
        </CardContent>
        {step === 'request' && (
          <CardFooter className="flex flex-col gap-4 pb-8 border-t bg-muted/10 pt-6">
            <div className="text-sm text-center text-muted-foreground">
              Remembered your password?{' '}
              <Link href={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>

      <div className="text-center">
        <Button variant="ghost" className="w-full h-11 gap-2 text-base font-bold text-muted-foreground border-2 border-transparent hover:border-muted hover:bg-muted/10 hover:text-foreground transition-all" asChild>
          <Link href={ROUTES.DISCOVER}>
            <ArrowLeft className="h-4 w-4" />
            Back to Tutors
          </Link>
        </Button>
      </div>
    </div>
  );
}
