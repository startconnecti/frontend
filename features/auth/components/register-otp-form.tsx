'use client';

import { useForm } from 'react-hook-form';
import { setFormErrors } from '@/lib/api/query-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/auth-store';
import { useVerifyRegisterOtpMutation } from '../hooks/use-verify-register-otp-mutation';
import { useResendRegisterOtpMutation } from '../hooks/use-resend-register-otp-mutation';
import { AuthAlert } from './auth-alert';

const otpSchema = z.object({
  otp: z.string().length(6, 'Verification code must be 6 digits'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface RegisterOtpFormProps {
  email: string;
  role: 'student' | 'tutor';
  onBack: () => void;
}

export function RegisterOtpForm({ email, role, onBack }: RegisterOtpFormProps) {
  const router = useRouter();
  const verifyMutation = useVerifyRegisterOtpMutation();
  const resendMutation = useResendRegisterOtpMutation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    try {
      const response = await verifyMutation.mutateAsync({
        email,
        otp: values.otp,
      });

      // Update global auth store
      setAuth(response.user, response.accessToken, response.refreshToken);

      // Redirect to correct onboarding based on role
      const redirectPath = role === 'student' ? ROUTES.ONBOARDING_STUDENT : ROUTES.ONBOARDING_TUTOR;
      router.push(redirectPath);
    } catch (err) {
      setFormErrors(err, form.setError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to <span className="font-bold text-foreground">{email}</span>
        </p>
      </div>

      {verifyMutation.isError && (
        <AuthAlert 
          type="error"
          title="Verification failed"
          message={verifyMutation.error?.message || 'Invalid code. Please check and try again.'}
        />
      )}

      {resendMutation.isError && (
        <AuthAlert 
          type="error"
          title="Resend failed"
          message={resendMutation.error?.message || 'Failed to resend code. Please try again later.'}
        />
      )}

      {resendMutation.isSuccess && (
        <AuthAlert 
          type="success"
          title="Code resent"
          message={resendMutation.data?.message || 'A new verification code has been sent to your email.'}
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
                'Verify & Continue'
              )}
            </Button>

            <Button 
              type="button" 
              variant="ghost" 
              className="w-full h-11 gap-2 text-base font-bold text-muted-foreground border-2 border-dashed border-muted hover:border-primary/30 hover:bg-muted/30 hover:text-foreground transition-all"
              disabled={verifyMutation.isPending || resendMutation.isPending}
              onClick={() => resendMutation.mutate({ email })}
            >
              <RefreshCw className={`h-4 w-4 ${resendMutation.isPending ? 'animate-spin' : ''}`} />
              {resendMutation.isPending ? 'Sending...' : 'Resend code'}
            </Button>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11 text-base font-bold gap-2 border-2 hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={onBack}
            disabled={verifyMutation.isPending}
          >
            <ArrowLeft className="h-4 w-4" />
            Use different email
          </Button>
        </form>
      </Form>
    </div>
  );
}
