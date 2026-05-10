'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useVerifyForgotPasswordOtpMutation } from '../hooks/use-forgot-password-verify-otp-mutation';
import { AuthAlert } from './auth-alert';

const otpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be 6 digits'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface ForgotPasswordOtpFormProps {
  email: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
}

export function ForgotPasswordOtpForm({ email, onSuccess, onBack }: ForgotPasswordOtpFormProps) {
  const verifyMutation = useVerifyForgotPasswordOtpMutation();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    try {
      await verifyMutation.mutateAsync({
        email,
        otp: values.otp,
      });
      onSuccess(values.otp);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          We've sent a code to <span className="font-bold text-foreground">{email}</span>. Please enter it below.
        </p>
      </div>

      {verifyMutation.isError && (
        <AuthAlert 
          type="error"
          title="Invalid code"
          message={verifyMutation.error?.message || 'The code you entered is incorrect. Please try again.'}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="sr-only">Verification Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000000" 
                    className="text-center text-3xl h-16 tracking-[0.5em] font-black"
                    maxLength={6}
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10" 
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <Button 
              type="button" 
              variant="ghost" 
              className="w-full gap-2 text-xs text-muted-foreground"
              disabled={verifyMutation.isPending}
            >
              <RefreshCw className="h-3 w-3" />
              Resend code (Simulated)
            </Button>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={onBack}
            disabled={verifyMutation.isPending}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to email
          </Button>
        </form>
      </Form>
    </div>
  );
}
