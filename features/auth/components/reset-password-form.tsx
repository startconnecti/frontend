'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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
import { AUTH_CONSTANTS } from '../constants';
import { useResetPasswordMutation } from '../hooks/use-reset-password-mutation';
import { AuthAlert } from './auth-alert';

const resetSchema = z.object({
  password: z.string().min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordFormProps {
  email: string;
  otp: string;
}

export function ResetPasswordForm({ email, otp }: ResetPasswordFormProps) {
  const resetMutation = useResetPasswordMutation();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    try {
      await resetMutation.mutateAsync({
        email,
        otp,
        password: values.password,
      });
    } catch (err) {
      // Error handled by mutation state
    }
  };

  if (resetMutation.isSuccess) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold" style={{ color: '#2C1208' }}>Password Reset Successful</h3>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully updated. You can now sign in with your new credentials.
          </p>
        </div>
        <Button className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10" asChild>
          <Link href={ROUTES.LOGIN}>
            Go to Login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Create a new secure password for your account.
        </p>
      </div>

      {resetMutation.isError && (
        <AuthAlert 
          type="error"
          title="Reset failed"
          message={resetMutation.error?.message || 'Something went wrong. Please try again.'}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10 mt-2" 
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
